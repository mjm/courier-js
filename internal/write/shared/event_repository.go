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

	// TODO fancy parameters

	_, err := r.dynamo.PutItemWithContext(ctx, &dynamodb.PutItemInput{
		TableName: &r.dynamoConfig.TableName,
		Item:      item,
	})
	if err != nil {
		return err
	}

	return nil
}
