package feeds

import (
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/model"
)

type feedPager struct {
	TableName string
	UserID    string
}

func (p *feedPager) Query(cursor *pager.Cursor) *dynamodb.QueryInput {
	pk := "USER#" + p.UserID

	var startKey map[string]*dynamodb.AttributeValue
	if cursor != nil {
		comps := strings.SplitN(string(*cursor), "###", 2)
		sk, lsisk := comps[0], comps[1]

		startKey = map[string]*dynamodb.AttributeValue{
			db.PK:     {S: aws.String(pk)},
			db.SK:     {S: aws.String(sk)},
			db.LSI1SK: {S: aws.String(lsisk)},
		}
	}

	return &dynamodb.QueryInput{
		TableName:              &p.TableName,
		IndexName:              aws.String(db.LSI1),
		KeyConditionExpression: aws.String(`#pk = :pk and begins_with(#sk, :sk)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk": aws.String(db.PK),
			"#sk": aws.String(db.LSI1SK),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":pk": {S: aws.String(pk)},
			":sk": {S: aws.String("FEED#")},
		},
		ExclusiveStartKey: startKey,
	}
}

func (p *feedPager) ScanEdge(item map[string]*dynamodb.AttributeValue) (pager.Edge, error) {
	f, err := model.NewFeedFromAttrs(item)
	if err != nil {
		return nil, err
	}

	return FeedEdge(*f), nil
}

type FeedEdge model.Feed

func (e FeedEdge) Cursor() pager.Cursor {
	return e.ByTitleCursor
}
