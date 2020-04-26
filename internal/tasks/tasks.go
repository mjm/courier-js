package tasks

import (
	"context"
	"fmt"
	"time"

	cloudtasks "cloud.google.com/go/cloudtasks/apiv2"
	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/google/wire"
	"github.com/googleapis/gax-go/v2"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/propagation"
	"go.opentelemetry.io/otel/api/trace"
	"google.golang.org/api/option"
	taskspb "google.golang.org/genproto/googleapis/cloud/tasks/v2"

	"github.com/mjm/courier-js/internal/functions"
)

var DefaultSet = wire.NewSet(New, NewConfig)

type tasksClient interface {
	CreateTask(ctx context.Context, req *taskspb.CreateTaskRequest, opts ...gax.CallOption) (*taskspb.Task, error)
}

type Tasks struct {
	url            string
	queue          string
	serviceAccount string
	client         tasksClient
}

func New(cfg Config) (*Tasks, error) {
	ctx := context.Background()
	client, err := cloudtasks.NewClient(ctx, option.WithCredentialsJSON([]byte(cfg.CredentialsJSON)))
	if err != nil {
		return nil, err
	}

	return &Tasks{
		url:            cfg.TaskURL,
		queue:          cfg.Queue,
		serviceAccount: cfg.ServiceAccount,
		client:         client,
	}, nil
}

type taskOption interface {
	Apply(*Tasks, *taskspb.CreateTaskRequest)
}

type fnTaskOption func(*Tasks, *taskspb.CreateTaskRequest)

func (o fnTaskOption) Apply(t *Tasks, r *taskspb.CreateTaskRequest) {
	o(t, r)
}

func After(d time.Duration) taskOption {
	return fnTaskOption(func(_ *Tasks, r *taskspb.CreateTaskRequest) {
		t, err := ptypes.TimestampProto(time.Now().Add(d))
		if err != nil {
			panic(err)
		}
		r.GetTask().ScheduleTime = t
	})
}

func Named(name string) taskOption {
	return fnTaskOption(func(t *Tasks, r *taskspb.CreateTaskRequest) {
		r.GetTask().Name = fmt.Sprintf("%s/tasks/%s", t.queue, name)
	})
}

func (t *Tasks) Enqueue(ctx context.Context, task proto.Message, opts ...taskOption) (string, error) {
	ctx, span := tracer.Start(ctx, "Tasks.Enqueue",
		trace.WithSpanKind(trace.SpanKindProducer),
		trace.WithAttributes(
			key.String("messaging.system", "google_cloud_tasks"),
			key.String("messaging.destination_kind", "queue"),
			key.String("messaging.destination", t.queue),
			key.String("messaging.url", t.url),
			key.String("messaging.operation", "send")))
	defer span.End()

	req, err := t.newTaskRequest(ctx, task)
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	for _, opt := range opts {
		opt.Apply(t, req)
	}

	createdTask, err := t.client.CreateTask(ctx, req)
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	span.SetAttributes(
		nameKey.String(createdTask.GetName()),
		key.String("messaging.message_id", createdTask.GetName()))

	return createdTask.GetName(), nil
}

func (t *Tasks) newTaskRequest(ctx context.Context, task proto.Message) (*taskspb.CreateTaskRequest, error) {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(
		typeKey.String(fmt.Sprintf("%T", task)),
		queueKey.String(t.queue),
		urlKey.String(t.url),
		serviceAccountKey.String(t.serviceAccount))

	a, err := ptypes.MarshalAny(task)
	if err != nil {
		return nil, err
	}

	data, err := proto.Marshal(a)
	if err != nil {
		return nil, err
	}

	span.SetAttributes(dataLenKey.Int(len(data)))

	headers := make(taskHeaders)
	propagation.InjectHTTP(ctx, functions.Propagators, headers)

	httpReq := &taskspb.HttpRequest{
		Body:       data,
		HttpMethod: taskspb.HttpMethod_POST,
		Url:        t.url,
		Headers:    headers,
	}

	if t.serviceAccount != "" {
		httpReq.AuthorizationHeader = &taskspb.HttpRequest_OidcToken{
			OidcToken: &taskspb.OidcToken{
				ServiceAccountEmail: t.serviceAccount,
			},
		}
	}

	req := &taskspb.CreateTaskRequest{
		Parent: t.queue,
		Task: &taskspb.Task{
			MessageType: &taskspb.Task_HttpRequest{
				HttpRequest: httpReq,
			},
		},
	}

	return req, nil
}
