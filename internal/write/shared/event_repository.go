package shared

import (
	"context"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/jonboulle/clockwork"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/shared/model"
)

type EventRepository struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
	clock        clockwork.Clock
}

func NewEventRepository(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig, clock clockwork.Clock) *EventRepository {
	return &EventRepository{dynamo: dynamo, dynamoConfig: dynamoConfig, clock: clock}
}

func (r *EventRepository) Create(ctx context.Context, event *model.Event) error {
	id := model.UserEventID{
		UserID:  event.UserID,
		EventID: event.ID,
	}
	pk, sk := id.PrimaryKeyValues()

	now := model.FormatTime(r.clock.Now())

	item := map[string]*dynamodb.AttributeValue{
		db.PK:              {S: &pk},
		db.SK:              {S: &sk},
		db.Type:            {S: aws.String(model.TypeEvent)},
		model.ColCreatedAt: {S: &now},
		model.ColEventType: {S: aws.String(string(event.EventType))},
	}

	if fi := event.Feed; fi != nil {
		item[model.ColFeedID] = &dynamodb.AttributeValue{S: aws.String(string(fi.ID))}

		if fi.Autopost != nil {
			item[model.ColAutopost] = &dynamodb.AttributeValue{BOOL: fi.Autopost}
		}
	}

	if ti := event.TweetGroup; ti != nil {
		item[model.ColFeedID] = &dynamodb.AttributeValue{S: aws.String(string(ti.ID.FeedID))}
		item[model.ColItemID] = &dynamodb.AttributeValue{S: aws.String(ti.ID.ItemID)}
	}

	if event.SubscriptionID != "" {
		item[model.ColSubscriptionID] = &dynamodb.AttributeValue{S: aws.String(event.SubscriptionID)}
	}

	_, err := r.dynamo.PutItemWithContext(ctx, &dynamodb.PutItemInput{
		TableName: &r.dynamoConfig.TableName,
		Item:      item,
	})
	if err != nil {
		return err
	}

	return nil
}
