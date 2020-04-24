package tweets

import (
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/model"
)

// Filter is a predefined filter for which tweets to list in the pager.
type Filter string

const (
	// NoFilter shows all tweets without exclusions.
	NoFilter Filter = ""
	// UpcomingFilter shows only draft tweets.
	UpcomingFilter Filter = "UPCOMING"
	// PastFilter shows only canceled and posted tweets.
	PastFilter Filter = "PAST"
)

type tweetPager struct {
	TableName string
	UserID    string
	Filter    Filter
}

func (p *tweetPager) Query(cursor *pager.Cursor) *dynamodb.QueryInput {
	pk := "USER#" + p.UserID

	var startKey map[string]*dynamodb.AttributeValue
	if cursor != nil {
		comps := strings.SplitN(string(*cursor), "###", 3)
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
		KeyConditionExpression: aws.String(`#pk = :pk and begins_with(#sk, :filter)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk": aws.String(db.PK),
			"#sk": aws.String(db.LSI1SK),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":pk":     {S: aws.String(pk)},
			":filter": {S: aws.String(string(p.Filter))},
		},
		ExclusiveStartKey: startKey,
		ScanIndexForward:  aws.Bool(false),
	}
}

func (p *tweetPager) ScanEdge(item map[string]*dynamodb.AttributeValue) (pager.Edge, error) {
	t, err := model.NewTweetGroupFromAttrs(item)
	if err != nil {
		return nil, err
	}

	return &TweetGroupEdge{
		TweetGroup: *t,
		cursor:     pager.Cursor(aws.StringValue(item[db.SK].S) + "###" + aws.StringValue(item[db.LSI1SK].S)),
	}, nil
}

type TweetGroupEdge struct {
	model.TweetGroup
	cursor pager.Cursor
}

func (e *TweetGroupEdge) Cursor() pager.Cursor {
	return e.cursor
}
