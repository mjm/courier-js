package user

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/model"
)

type eventPager struct {
	TableName string
	UserID    string
}

func (p *eventPager) Query(cursor *pager.Cursor) *dynamodb.QueryInput {
	pk := "USEREVENTS#" + p.UserID

	var startKey map[string]*dynamodb.AttributeValue
	if cursor != nil {
		sk := string(*cursor)
		startKey = map[string]*dynamodb.AttributeValue{
			db.PK: {S: aws.String(pk)},
			db.SK: {S: aws.String(sk)},
		}
	}

	return &dynamodb.QueryInput{
		TableName:              &p.TableName,
		KeyConditionExpression: aws.String(`#pk = :pk`),
		ExpressionAttributeNames: map[string]*string{
			"#pk": aws.String(db.PK),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":pk": {S: aws.String(pk)},
		},
		ExclusiveStartKey: startKey,
		ScanIndexForward:  aws.Bool(false),
	}
}

func (p *eventPager) ScanEdge(item map[string]*dynamodb.AttributeValue) (pager.Edge, error) {
	e, err := model.NewEventFromAttrs(item)
	if err != nil {
		return nil, err
	}

	return &EventEdge{
		Event:  *e,
		cursor: pager.Cursor(aws.StringValue(item[db.SK].S)),
	}, nil
}

type EventEdge struct {
	model.Event
	cursor pager.Cursor
}

func (e *EventEdge) Cursor() pager.Cursor {
	return e.cursor
}
