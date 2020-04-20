package feeds

import (
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/model"
)

type postPagerDynamo struct {
	TableName string
	FeedID    model.FeedID
}

func (p *postPagerDynamo) Query(cursor *pager.Cursor) *dynamodb.QueryInput {
	pk := "FEED#" + string(p.FeedID)

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
			":sk": {S: aws.String("POST#")},
		},
		ScanIndexForward:  aws.Bool(false),
		ExclusiveStartKey: startKey,
	}
}

func (p *postPagerDynamo) ScanEdge(item map[string]*dynamodb.AttributeValue) (pager.Edge, error) {
	post, err := model.NewPostFromAttrs(item)
	if err != nil {
		return nil, err
	}

	return &PostEdge{
		Post:   *post,
		cursor: pager.Cursor(aws.StringValue(item[db.SK].S) + "###" + aws.StringValue(item[db.LSI1SK].S)),
	}, nil
}

type PostEdge struct {
	model.Post
	cursor pager.Cursor
}

func (e *PostEdge) Cursor() pager.Cursor {
	return e.cursor
}
