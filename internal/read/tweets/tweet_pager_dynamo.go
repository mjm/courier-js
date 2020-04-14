package tweets

import (
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/model"
)

type tweetPagerDynamo struct {
	TableName string
	UserID    string
	Filter    Filter
}

func (p *tweetPagerDynamo) Query(cursor *pager.Cursor) *dynamodb.QueryInput {
	var startKey map[string]*dynamodb.AttributeValue
	if cursor != nil {
		comps := strings.SplitN(string(*cursor), "###", 2)
		pk, sk := comps[0], comps[1]

		startKey = map[string]*dynamodb.AttributeValue{
			db.GSI1PK: {S: aws.String(pk)},
			db.GSI1SK: {S: aws.String(sk)},
		}
	}

	return &dynamodb.QueryInput{
		TableName:              &p.TableName,
		IndexName:              aws.String(db.GSI1),
		KeyConditionExpression: aws.String(`#pk = :pk and begins_with(#sk, :filter)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk": aws.String(db.GSI1PK),
			"#sk": aws.String(db.GSI1SK),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":pk":     {S: aws.String("USER#" + p.UserID)},
			":filter": {S: aws.String(string(p.Filter))},
		},
		ExclusiveStartKey: startKey,
		ScanIndexForward:  aws.Bool(false),
	}
}

func (p *tweetPagerDynamo) ScanEdge(item map[string]*dynamodb.AttributeValue) (pager.Edge, error) {
	t, err := model.NewTweetGroupFromAttrs(item)
	if err != nil {
		return nil, err
	}

	return &TweetGroupEdge{
		TweetGroup: *t,
		cursor:     pager.Cursor(aws.StringValue(item[db.GSI1PK].S) + "###" + aws.StringValue(item[db.GSI1SK].S)),
	}, nil
}

type TweetGroupEdge struct {
	model.TweetGroup
	cursor pager.Cursor
}

func (e *TweetGroupEdge) Cursor() pager.Cursor {
	return e.cursor
}
