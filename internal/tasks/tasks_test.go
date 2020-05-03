package tasks

//
// import (
// 	"context"
// 	"fmt"
// 	"testing"
// 	"time"
//
// 	"github.com/golang/protobuf/proto"
// 	"github.com/golang/protobuf/ptypes"
// 	"github.com/golang/protobuf/ptypes/any"
// 	"github.com/google/uuid"
// 	"github.com/googleapis/gax-go/v2"
// 	"github.com/stretchr/testify/assert"
// 	taskspb "google.golang.org/genproto/googleapis/cloud/tasks/v2"
//
// 	"github.com/mjm/courier-js/internal/shared/feeds"
// )
//
// type fakeTasksClient struct {
// 	creates []*taskspb.CreateTaskRequest
// }
//
// func (c *fakeTasksClient) CreateTask(ctx context.Context, req *taskspb.CreateTaskRequest, opts ...gax.CallOption) (*taskspb.Task, error) {
// 	c.creates = append(c.creates, req)
// 	result := proto.Clone(req.Task).(*taskspb.Task)
// 	if result.GetName() == "" {
// 		result.Name = fmt.Sprintf("%s/tasks/%s", req.Parent, uuid.New().String())
// 	}
// 	return result, nil
// }
//
// func TestTasksEnqueue(t *testing.T) {
// 	ctx := context.Background()
// 	tasks, client := newTasks()
//
// 	task := &feeds.RefreshFeedTask{
// 		UserId: "test_user",
// 		FeedId: "test_feed",
// 	}
// 	name, err := tasks.Enqueue(ctx, task)
// 	assert.NoError(t, err)
// 	assert.NotEmpty(t, name)
//
// 	assert.Equal(t, 1, len(client.creates))
// 	req := client.creates[0]
// 	assert.Equal(t, "projects/fake/locations/us-central1/queues/tasks", req.Parent)
// 	assert.Equal(t, "https://example.com/api/tasks", req.Task.GetHttpRequest().GetUrl())
// 	assert.NotEmpty(t, req.Task.GetHttpRequest().GetBody())
// 	assert.Equal(t, taskspb.HttpMethod_POST, req.Task.GetHttpRequest().GetHttpMethod())
// 	assert.Nil(t, req.Task.GetHttpRequest().GetOidcToken())
//
// 	var a any.Any
// 	assert.NoError(t, proto.Unmarshal(req.Task.GetHttpRequest().GetBody(), &a))
//
// 	var msg ptypes.DynamicAny
// 	assert.NoError(t, ptypes.UnmarshalAny(&a, &msg))
//
// 	assert.IsType(t, (*feeds.RefreshFeedTask)(nil), msg.Message)
// 	task = msg.Message.(*feeds.RefreshFeedTask)
// 	assert.Equal(t, "test_user", task.UserId)
// 	assert.Equal(t, "test_feed", task.FeedId)
// }
//
// func TestTasksEnqueueCustomName(t *testing.T) {
// 	ctx := context.Background()
// 	tasks, client := newTasks()
//
// 	task := &feeds.RefreshFeedTask{
// 		UserId: "test_user",
// 		FeedId: "test_feed",
// 	}
// 	name, err := tasks.Enqueue(ctx, task, Named("my-new-task"))
// 	assert.NoError(t, err)
// 	assert.Equal(t, "projects/fake/locations/us-central1/queues/tasks/tasks/my-new-task", name)
//
// 	assert.Equal(t, 1, len(client.creates))
// 	req := client.creates[0]
// 	assert.Equal(t, "projects/fake/locations/us-central1/queues/tasks", req.Parent)
// 	assert.Equal(t, "https://example.com/api/tasks", req.Task.GetHttpRequest().GetUrl())
// 	assert.NotEmpty(t, req.Task.GetHttpRequest().GetBody())
// 	assert.Equal(t, taskspb.HttpMethod_POST, req.Task.GetHttpRequest().GetHttpMethod())
// 	assert.Equal(t, "projects/fake/locations/us-central1/queues/tasks/tasks/my-new-task", req.Task.Name)
// }
//
// func TestTasksEnqueueAfter(t *testing.T) {
// 	ctx := context.Background()
// 	tasks, client := newTasks()
//
// 	task := &feeds.RefreshFeedTask{
// 		UserId: "test_user",
// 		FeedId: "test_feed",
// 	}
// 	name, err := tasks.Enqueue(ctx, task, After(3*time.Minute))
// 	assert.NoError(t, err)
// 	assert.NotEmpty(t, name)
//
// 	assert.Equal(t, 1, len(client.creates))
// 	req := client.creates[0]
// 	assert.Equal(t, "projects/fake/locations/us-central1/queues/tasks", req.Parent)
// 	assert.Equal(t, "https://example.com/api/tasks", req.Task.GetHttpRequest().GetUrl())
// 	assert.NotEmpty(t, req.Task.GetHttpRequest().GetBody())
// 	assert.Equal(t, taskspb.HttpMethod_POST, req.Task.GetHttpRequest().GetHttpMethod())
// 	assert.Greater(t, req.Task.GetScheduleTime().Seconds, time.Now().Unix()+150)
// }
//
// func TestTasksEnqueueWithServiceAccount(t *testing.T) {
// 	ctx := context.Background()
// 	tasks, client := newTasks()
// 	tasks.serviceAccount = "foo@bar.com"
//
// 	task := &feeds.RefreshFeedTask{
// 		UserId: "test_user",
// 		FeedId: "test_feed",
// 	}
// 	name, err := tasks.Enqueue(ctx, task)
// 	assert.NoError(t, err)
// 	assert.NotEmpty(t, name)
//
// 	assert.Equal(t, 1, len(client.creates))
// 	req := client.creates[0]
// 	assert.Equal(t, "projects/fake/locations/us-central1/queues/tasks", req.Parent)
// 	assert.Equal(t, "https://example.com/api/tasks", req.Task.GetHttpRequest().GetUrl())
// 	assert.NotEmpty(t, req.Task.GetHttpRequest().GetBody())
// 	assert.Equal(t, taskspb.HttpMethod_POST, req.Task.GetHttpRequest().GetHttpMethod())
// 	assert.Equal(t, "foo@bar.com", req.Task.GetHttpRequest().GetOidcToken().GetServiceAccountEmail())
// }
//
// func newTasks() (*Tasks, *fakeTasksClient) {
// 	client := &fakeTasksClient{}
// 	return &Tasks{
// 		client: client,
// 		url:    "https://example.com/api/tasks",
// 		queue:  "projects/fake/locations/us-central1/queues/tasks",
// 	}, client
// }
