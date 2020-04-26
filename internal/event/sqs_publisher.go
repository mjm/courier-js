package event

import (
	"context"
	"encoding/base64"
	"reflect"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
	"github.com/aws/aws-sdk-go/service/sqs/sqsiface"
	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/google/wire"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/config"
)

var AWSPublishingSet = wire.NewSet(wire.Bind(new(Sink), new(*SQSPublisher)), NewSQSPublisher, NewSQSPublisherConfig)

type SQSPublisherConfig struct {
	QueueURL string `secret:"events/queue-url"`
}

func NewSQSPublisherConfig(l *config.Loader) (cfg SQSPublisherConfig, err error) {
	err = l.Load(context.Background(), &cfg)
	return
}

type SQSPublisher struct {
	cfg SQSPublisherConfig
	sqs sqsiface.SQSAPI
}

func NewSQSPublisher(cfg SQSPublisherConfig) (*SQSPublisher, error) {
	sess, err := session.NewSession(aws.NewConfig())
	if err != nil {
		return nil, err
	}

	return &SQSPublisher{
		cfg: cfg,
		sqs: sqs.New(sess),
	}, nil
}

func (p *SQSPublisher) Fire(ctx context.Context, evt interface{}) {
	ctx, span := tracer.Start(ctx, "Publisher.Fire",
		trace.WithSpanKind(trace.SpanKindProducer),
		trace.WithAttributes(
			typeKey(reflect.TypeOf(evt).String()),
			key.String("messaging.system", "sqs"),
			key.String("messaging.operation", "send"),
			key.String("messaging.destination_kind", "queue"),
			key.String("messaging.destination", p.cfg.QueueURL)))
	defer span.End()

	evtPtr := reflect.New(reflect.TypeOf(evt))
	evtPtr.Elem().Set(reflect.ValueOf(evt))

	evtMsg, ok := evtPtr.Interface().(proto.Message)
	if !ok {
		span.SetAttributes(isProtoKey(false))
		return
	}

	span.SetAttributes(isProtoKey(true))

	a, err := ptypes.MarshalAny(evtMsg)
	if err != nil {
		span.RecordError(ctx, err)
		return
	}

	data, err := proto.Marshal(a)
	if err != nil {
		span.RecordError(ctx, err)
		return
	}

	span.SetAttributes(dataLenKey(len(data)))
	dataStr := base64.StdEncoding.EncodeToString(data)

	sc := span.SpanContext()

	res, err := p.sqs.SendMessageWithContext(ctx, &sqs.SendMessageInput{
		QueueUrl:    &p.cfg.QueueURL,
		MessageBody: aws.String(dataStr),
		MessageAttributes: map[string]*sqs.MessageAttributeValue{
			"TraceID": {StringValue: aws.String(sc.TraceIDString())},
			"SpanID":  {StringValue: aws.String(sc.SpanIDString())},
		},
	})
	if err != nil {
		span.RecordError(ctx, err)
		return
	}

	id := aws.StringValue(res.MessageId)
	span.SetAttributes(
		publishedIDKey(id),
		key.String("messaging.message_id", id))
}
