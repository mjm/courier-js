package tasks

import (
	"context"
	"encoding/base64"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
	"github.com/aws/aws-sdk-go/service/sqs/sqsiface"
	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/google/wire"
	"github.com/segmentio/ksuid"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/event"
)

var DefaultSet = wire.NewSet(New)

type Tasks struct {
	cfg event.SQSPublisherConfig
	sqs sqsiface.SQSAPI
}

func New(cfg event.SQSPublisherConfig) (*Tasks, error) {
	sess, err := session.NewSession(aws.NewConfig())
	if err != nil {
		return nil, err
	}

	return &Tasks{
		cfg: cfg,
		sqs: sqs.New(sess),
	}, nil
}

type taskOption interface {
	Apply(*Tasks, *sqs.SendMessageInput, *FireTaskEvent)
}

type fnTaskOption func(*Tasks, *sqs.SendMessageInput, *FireTaskEvent)

func (o fnTaskOption) Apply(t *Tasks, input *sqs.SendMessageInput, msg *FireTaskEvent) {
	o(t, input, msg)
}

func After(d time.Duration) taskOption {
	return fnTaskOption(func(_ *Tasks, input *sqs.SendMessageInput, _ *FireTaskEvent) {
		input.SetDelaySeconds(int64(d.Seconds()))
	})
}

func Named(name string) taskOption {
	return fnTaskOption(func(t *Tasks, _ *sqs.SendMessageInput, msg *FireTaskEvent) {
		msg.Name = name
	})
}

func (t *Tasks) Enqueue(ctx context.Context, task proto.Message, opts ...taskOption) (string, error) {
	ctx, span := tracer.Start(ctx, "Tasks.Enqueue",
		trace.WithSpanKind(trace.SpanKindProducer),
		trace.WithAttributes(
			key.String("messaging.system", "sqs"),
			key.String("messaging.destination_kind", "queue"),
			key.String("messaging.destination", t.cfg.QueueURL),
			key.String("messaging.operation", "send")))
	defer span.End()

	evt := &FireTaskEvent{
		Name: ksuid.New().String(),
	}

	var err error
	evt.Task, err = ptypes.MarshalAny(task)
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	input := &sqs.SendMessageInput{
		QueueUrl: aws.String(t.cfg.QueueURL),
		MessageAttributes: map[string]*sqs.MessageAttributeValue{
			"TraceID": {
				DataType:    aws.String("String"),
				StringValue: aws.String(span.SpanContext().TraceIDString()),
			},
			"SpanID": {
				DataType:    aws.String("String"),
				StringValue: aws.String(span.SpanContext().SpanIDString()),
			},
		},
	}

	for _, opt := range opts {
		opt.Apply(t, input, evt)
	}

	a, err := ptypes.MarshalAny(evt)
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	data, err := proto.Marshal(a)
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	span.SetAttributes(dataLenKey.Int(len(data)))

	input.SetMessageBody(base64.StdEncoding.EncodeToString(data))
	res, err := t.sqs.SendMessageWithContext(ctx, input)
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	span.SetAttributes(
		nameKey.String(evt.Name),
		key.String("messaging.message_id", aws.StringValue(res.MessageId)))
	return aws.StringValue(res.MessageId), nil
}
