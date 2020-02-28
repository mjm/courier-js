package tasks

import (
	"context"
	"fmt"

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

func (t *Tasks) Enqueue(ctx context.Context, task proto.Message) error {
	ctx = trace.Start(ctx, "Enqueue task")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "task.type", fmt.Sprintf("%T", task))

	a, err := ptypes.MarshalAny(task)
	if err != nil {
		trace.Error(ctx, err)
		return err
	}

	data, err := proto.Marshal(a)
	if err != nil {
		trace.Error(ctx, err)
		return err
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

	_, err = t.client.CreateTask(ctx, req)
	if err != nil {
		trace.Error(ctx, err)
		return err
	}

	return nil
}
