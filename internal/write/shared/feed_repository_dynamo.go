package shared

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/write/feeds"
)

const (
	colURL              = "URL"
	colTitle            = "Title"
	colHomePageURL      = "HomePageURL"
	colRefreshedAt      = "RefreshedAt"
	colCreatedAt        = "CreatedAt"
	colUpdatedAt        = "UpdatedAt"
	colMicropubEndpoint = "MicropubEndpoint"
	colCachingHeaders   = "CachingHeaders"
	colEtag             = "Etag"
	colLastModified     = "LastModified"
	colAutopost         = "Autopost"
)

type FeedRepositoryDynamo struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
}

func NewFeedRepositoryDynamo(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *FeedRepositoryDynamo {
	return &FeedRepositoryDynamo{
		dynamo:       dynamo,
		dynamoConfig: dynamoConfig,
	}
}

func (r *FeedRepositoryDynamo) Get(ctx context.Context, userID string, feedID feeds.FeedID) (*FeedDynamo, error) {
	res, err := r.dynamo.GetItemWithContext(ctx, &dynamodb.GetItemInput{
		TableName: &r.dynamoConfig.TableName,
		Key:       r.primaryKey(userID, feedID),
	})
	if err != nil {
		return nil, err
	}

	return feedFromAttributes(res.Item)
}

func (r *FeedRepositoryDynamo) GetWithRecentPosts(ctx context.Context, feedID feeds.FeedID) (*FeedDynamo, []*PostDynamo, error) {
	pk := fmt.Sprintf("FEED#%s", feedID)

	res, err := r.dynamo.QueryWithContext(ctx, &dynamodb.QueryInput{
		TableName:              &r.dynamoConfig.TableName,
		IndexName:              aws.String(db.GSI1),
		KeyConditionExpression: aws.String(`#pk = :pk and #sk <= :sk`),
		ExpressionAttributeNames: map[string]*string{
			"#pk": aws.String(db.GSI1PK),
			"#sk": aws.String(db.GSI1SK),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":pk": {S: &pk},
			":sk": {S: &pk},
		},
		Limit:            aws.Int64(11), // feed record + 10 posts
		ScanIndexForward: aws.Bool(false),
	})
	if err != nil {
		return nil, nil, err
	}

	if len(res.Items) < 1 {
		return nil, nil, feeds.ErrNoFeed
	}

	feed, err := feedFromAttributes(res.Items[0])
	if err != nil {
		return nil, nil, err
	}

	var posts []*PostDynamo
	for _, item := range res.Items[1:] {
		post, err := postFromAttributes(item)
		if err != nil {
			return nil, nil, err
		}
		posts = append(posts, post)
	}

	return feed, posts, nil
}

func (r *FeedRepositoryDynamo) Create(ctx context.Context, userID string, feedID feeds.FeedID, url string) error {
	pk, sk := r.primaryKeyValues(userID, feedID)
	now := time.Now().Format(time.RFC3339)
	_, err := r.dynamo.PutItemWithContext(ctx, &dynamodb.PutItemInput{
		TableName: &r.dynamoConfig.TableName,
		Item: map[string]*dynamodb.AttributeValue{
			db.PK:       {S: &pk},
			db.SK:       {S: &sk},
			db.GSI1PK:   {S: &sk},
			db.GSI1SK:   {S: &sk},
			"URL":       {S: &url},
			"Autopost":  {BOOL: aws.Bool(false)},
			"CreatedAt": {S: &now},
			"UpdatedAt": {S: &now},
		},
		ConditionExpression: aws.String("attribute_not_exists(#pk)"),
		ExpressionAttributeNames: map[string]*string{
			"#pk": aws.String(db.PK),
		},
	})
	if err != nil {
		return err
	}

	return nil
}

type UpdateFeedParamsDynamo struct {
	ID     feeds.FeedID
	UserID string

	Title            string
	HomePageURL      string
	CachingHeaders   *feeds.CachingHeaders
	MicropubEndpoint string
}

func (r *FeedRepositoryDynamo) UpdateDetails(ctx context.Context, params UpdateFeedParamsDynamo) error {
	var toSet []string
	var toRemove []string
	vals := map[string]*dynamodb.AttributeValue{}

	setString := func(col string, val string) {
		if val != "" {
			toSet = append(toSet, fmt.Sprintf("#%s = :%s", col, col))
			vals[":"+col] = &dynamodb.AttributeValue{S: aws.String(val)}
		} else {
			toRemove = append(toRemove, "#"+col)
		}
	}

	setString("title", params.Title)
	setString("home", params.HomePageURL)
	setString("mp", params.MicropubEndpoint)

	if params.CachingHeaders != nil {
		toSet = append(toSet, "#ch = :ch")
		vals[":ch"] = &dynamodb.AttributeValue{
			M: map[string]*dynamodb.AttributeValue{
				colEtag:         {S: aws.String(params.CachingHeaders.Etag)},
				colLastModified: {S: aws.String(params.CachingHeaders.LastModified)},
			},
		}
	} else {
		toRemove = append(toRemove, "#ch")
	}

	var expr string
	if len(toSet) > 0 {
		expr += "SET " + strings.Join(toSet, ", ") + " "
	} else {
		vals = nil
	}
	if len(toRemove) > 0 {
		expr += "REMOVE " + strings.Join(toRemove, ", ") + " "
	}

	_, err := r.dynamo.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 r.primaryKey(params.UserID, params.ID),
		UpdateExpression:    &expr,
		ConditionExpression: aws.String("attribute_exists(#pk)"),
		ExpressionAttributeNames: map[string]*string{
			"#pk":    aws.String(db.PK),
			"#title": aws.String(colTitle),
			"#home":  aws.String(colHomePageURL),
			"#ch":    aws.String(colCachingHeaders),
			"#mp":    aws.String(colMicropubEndpoint),
		},
		ExpressionAttributeValues: vals,
	})
	if err != nil {
		return err
	}

	return nil
}

type UpdateFeedSettingsParams struct {
	ID     feeds.FeedID
	UserID string

	Autopost bool
}

func (r *FeedRepositoryDynamo) UpdateSettings(ctx context.Context, params UpdateFeedSettingsParams) error {
	_, err := r.dynamo.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 r.primaryKey(params.UserID, params.ID),
		UpdateExpression:    aws.String(`SET #autopost = :autopost`),
		ConditionExpression: aws.String("attribute_exists(#pk)"),
		ExpressionAttributeNames: map[string]*string{
			"#pk":       aws.String(db.PK),
			"#autopost": aws.String(colAutopost),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":autopost": {BOOL: aws.Bool(params.Autopost)},
		},
	})
	if err != nil {
		return err
	}

	return nil
}

func (r *FeedRepositoryDynamo) primaryKeyValues(userID string, feedID feeds.FeedID) (string, string) {
	pk := fmt.Sprintf("USER#%s", userID)
	sk := fmt.Sprintf("FEED#%s", feedID)
	return pk, sk
}

func (r *FeedRepositoryDynamo) primaryKey(userID string, feedID feeds.FeedID) map[string]*dynamodb.AttributeValue {
	pk, sk := r.primaryKeyValues(userID, feedID)
	return map[string]*dynamodb.AttributeValue{
		db.PK: {S: &pk},
		db.SK: {S: &sk},
	}
}

func feedFromAttributes(attrs map[string]*dynamodb.AttributeValue) (*FeedDynamo, error) {
	userID := strings.SplitN(aws.StringValue(attrs[db.PK].S), "#", 2)[1]
	feedID := strings.SplitN(aws.StringValue(attrs[db.SK].S), "#", 2)[1]

	feed := &FeedDynamo{
		ID:       feeds.FeedID(feedID),
		UserID:   userID,
		URL:      aws.StringValue(attrs[colURL].S),
		Autopost: aws.BoolValue(attrs[colAutopost].BOOL),
	}

	if titleVal, ok := attrs[colTitle]; ok {
		feed.Title = aws.StringValue(titleVal.S)
	}

	if homePageURLVal, ok := attrs[colHomePageURL]; ok {
		feed.HomePageURL = aws.StringValue(homePageURLVal.S)
	}

	if refreshedAtVal, ok := attrs[colRefreshedAt]; ok {
		t, err := time.Parse(time.RFC3339, aws.StringValue(refreshedAtVal.S))
		if err != nil {
			return nil, err
		}
		feed.RefreshedAt = &t
	}

	var err error

	feed.CreatedAt, err = time.Parse(time.RFC3339, aws.StringValue(attrs[colCreatedAt].S))
	if err != nil {
		return nil, err
	}

	feed.UpdatedAt, err = time.Parse(time.RFC3339, aws.StringValue(attrs[colUpdatedAt].S))
	if err != nil {
		return nil, err
	}

	if micropubEndpointVal, ok := attrs[colMicropubEndpoint]; ok {
		feed.MicropubEndpoint = aws.StringValue(micropubEndpointVal.S)
	}

	if cachingHeadersVal, ok := attrs[colCachingHeaders]; ok {
		feed.CachingHeaders = &feeds.CachingHeaders{
			Etag:         aws.StringValue(cachingHeadersVal.M[colEtag].S),
			LastModified: aws.StringValue(cachingHeadersVal.M[colLastModified].S),
		}
	}

	return feed, nil
}
