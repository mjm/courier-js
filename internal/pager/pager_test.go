package pager

import (
	"fmt"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/mjm/courier-js/internal/db"
)

type testPager struct {
}

func (p *testPager) Query(cursor *Cursor) *dynamodb.QueryInput {
	var startKey map[string]*dynamodb.AttributeValue
	if cursor != nil {
		comps := strings.SplitN(string(*cursor), "###", 2)
		pk, sk := comps[0], comps[1]

		startKey = map[string]*dynamodb.AttributeValue{
			db.PK: {S: aws.String(pk)},
			db.SK: {S: aws.String(sk)},
		}
	}

	return &dynamodb.QueryInput{
		TableName:              aws.String("courier_test"),
		KeyConditionExpression: aws.String(`PK = :pk and SK < :sk`),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":pk": {S: aws.String("LIST#123")},
			":sk": {S: aws.String("LIST#123")},
		},
		ExclusiveStartKey: startKey,
		ScanIndexForward:  aws.Bool(false),
	}
}

func (p *testPager) ScanEdge(item map[string]*dynamodb.AttributeValue) (Edge, error) {
	return &testEdge{
		ID:     aws.StringValue(item["SK"].S),
		ListID: aws.StringValue(item["PK"].S),
		Text:   aws.StringValue(item["Text"].S),
	}, nil
}

type testEdge struct {
	ID     string
	ListID string
	Text   string
}

func (e *testEdge) Cursor() Cursor {
	return Cursor(e.ListID + "###" + e.ID)
}

func (suite *dynamoSuite) TestPagerEmptyTable() {
	p := &testPager{}
	conn, err := PagedDynamo(suite.Ctx(), suite.Dynamo(), p, First(10, nil))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Empty(conn.Edges)
	suite.False(conn.PageInfo.HasNextPage)
	suite.Nil(conn.PageInfo.StartCursor)
	suite.Nil(conn.PageInfo.EndCursor)
}

func (suite *dynamoSuite) TestPagerFirstPage() {
	suite.preloadTestRecords(3)

	p := &testPager{}
	conn, err := PagedDynamo(suite.Ctx(), suite.Dynamo(), p, First(10, nil))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Equal(3, len(conn.Edges))
	suite.False(conn.PageInfo.HasNextPage)
	suite.Equal(Cursor("LIST#123###ITEM#0003"), *conn.PageInfo.StartCursor)
	suite.Equal(Cursor("LIST#123###ITEM#0001"), *conn.PageInfo.EndCursor)

	suite.Equal(Cursor("LIST#123###ITEM#0003"), conn.Edges[0].(*testEdge).Cursor())
	suite.Equal("Item #3", conn.Edges[0].(*testEdge).Text)
	suite.Equal(Cursor("LIST#123###ITEM#0001"), conn.Edges[2].(*testEdge).Cursor())
}

func (suite *dynamoSuite) TestPagerMultiplePages() {
	suite.preloadTestRecords(8)

	p := &testPager{}
	conn, err := PagedDynamo(suite.Ctx(), suite.Dynamo(), p, First(5, nil))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Equal(5, len(conn.Edges))
	suite.True(conn.PageInfo.HasNextPage)
	suite.Equal(Cursor("LIST#123###ITEM#0004"), *conn.PageInfo.EndCursor)

	conn, err = PagedDynamo(suite.Ctx(), suite.Dynamo(), p, First(5, conn.PageInfo.EndCursor))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Equal(3, len(conn.Edges))
	suite.False(conn.PageInfo.HasNextPage)
	suite.Equal(Cursor("LIST#123###ITEM#0003"), conn.Edges[0].(*testEdge).Cursor())
	suite.Equal("Item #3", conn.Edges[0].(*testEdge).Text)
	suite.Equal(Cursor("LIST#123###ITEM#0001"), conn.Edges[2].(*testEdge).Cursor())
}

func (suite *dynamoSuite) preloadTestRecords(n int) {
	reqs := []*dynamodb.WriteRequest{
		{
			PutRequest: &dynamodb.PutRequest{
				Item: map[string]*dynamodb.AttributeValue{
					db.PK:   {S: aws.String("LIST#123")},
					db.SK:   {S: aws.String("LIST#123")},
					"Title": {S: aws.String("This is a list")},
				},
			},
		},
	}

	for i := 1; i <= n; i++ {
		reqs = append(reqs, &dynamodb.WriteRequest{
			PutRequest: &dynamodb.PutRequest{
				Item: map[string]*dynamodb.AttributeValue{
					db.PK:  {S: aws.String("LIST#123")},
					db.SK:  {S: aws.String(fmt.Sprintf("ITEM#%04d", i))},
					"Text": {S: aws.String(fmt.Sprintf("Item #%d", i))},
				},
			},
		})
	}

	_, err := suite.Dynamo().BatchWriteItemWithContext(suite.Ctx(), &dynamodb.BatchWriteItemInput{
		RequestItems: map[string][]*dynamodb.WriteRequest{
			suite.DynamoConfig().TableName: reqs,
		},
	})
	suite.Require().NoError(err)
}
