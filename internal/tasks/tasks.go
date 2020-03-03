package tasks

import (
	"context"
	"fmt"
	"time"

	cloudtasks "cloud.google.com/go/cloudtasks/apiv2"
	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/google/wire"
	"google.golang.org/api/option"
	taskspb "google.golang.org/genproto/googleapis/cloud/tasks/v2"

	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
)

var DefaultSet = wire.NewSet(New, NewConfig)

type Tasks struct {
	url            string
	queue          string
	serviceAccount string
	client         *cloudtasks.Client
}

func New(cfg Config, secretCfg secret.GCPConfig) (*Tasks, error) {
	ctx := context.Background()
	var o []option.ClientOption
	if secretCfg.CredentialsFile != "" {
		o = append(o, option.WithCredentialsFile(secretCfg.CredentialsFile))
	}
	client, err := cloudtasks.NewClient(ctx, o...)
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
	ctx = trace.Start(ctx, "Enqueue task")
	defer trace.Finish(ctx)

	req, err := t.newTaskRequest(ctx, task)
	if err != nil {
		trace.Error(ctx, err)
		return "", err
	}

	for _, opt := range opts {
		opt.Apply(t, req)
	}

	createdTask, err := t.client.CreateTask(ctx, req)
	if err != nil {
		trace.Error(ctx, err)
		return "", err
	}

	trace.AddField(ctx, "task.name", createdTask.GetName())

	return createdTask.GetName(), nil
}

func (t *Tasks) newTaskRequest(ctx context.Context, task proto.Message) (*taskspb.CreateTaskRequest, error) {
	trace.AddField(ctx, "task.type", fmt.Sprintf("%T", task))

	a, err := ptypes.MarshalAny(task)
	if err != nil {
		return nil, err
	}

	data, err := proto.Marshal(a)
	if err != nil {
		return nil, err
	}

	trace.AddField(ctx, "task.data_length", len(data))

	req := &taskspb.CreateTaskRequest{
		Parent: t.queue,
		Task: &taskspb.Task{
			MessageType: &taskspb.Task_HttpRequest{
				HttpRequest: &taskspb.HttpRequest{
					Body:       data,
					HttpMethod: taskspb.HttpMethod_POST,
					Url:        t.url,
					AuthorizationHeader: &taskspb.HttpRequest_OidcToken{
						OidcToken: &taskspb.OidcToken{
							ServiceAccountEmail: t.serviceAccount,
						},
					},
				},
			},
		},
	}
	return req, nil
}
