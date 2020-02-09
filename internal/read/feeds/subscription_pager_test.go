package feeds

import (
	"context"
	"fmt"

	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/write/feeds"
)

func (suite *feedsSuite) TestSubscriptionsEmpty() {
	ctx := context.Background()
	conn, err := suite.subQueries.Paged(ctx, "test_user", pager.First(10, nil))
	suite.NoError(err)
	suite.Equal(0, len(conn.Edges))
	suite.Equal(int32(0), conn.TotalCount)
	suite.False(conn.PageInfo.HasNextPage)
	suite.False(conn.PageInfo.HasPreviousPage)
	suite.Nil(conn.PageInfo.StartCursor)
	suite.Nil(conn.PageInfo.EndCursor)
}

func (suite *feedsSuite) TestSubscriptionsLessThanFullPage() {
	ctx := context.Background()
	suite.NoError(suite.createSubscriptions(ctx, 3))

	conn, err := suite.subQueries.Paged(ctx, "test_user", pager.First(10, nil))
	suite.NoError(err)

	suite.Equal(3, len(conn.Edges))
	suite.Equal(int32(3), conn.TotalCount)
	suite.False(conn.PageInfo.HasNextPage)
	suite.False(conn.PageInfo.HasPreviousPage)
	suite.Equal(pager.Cursor("https://www.example.com/feed0.json"), *conn.PageInfo.StartCursor)
	suite.Equal(pager.Cursor("https://www.example.com/feed2.json"), *conn.PageInfo.EndCursor)

	edge, ok := conn.Edges[0].(*SubscriptionEdge)
	suite.True(ok)
	suite.Equal("test_user", edge.UserID)
	suite.Equal(pager.Cursor("https://www.example.com/feed0.json"), edge.Cursor())
}

func (suite *feedsSuite) TestSubscriptionsExactlyFullPage() {
	ctx := context.Background()
	suite.NoError(suite.createSubscriptions(ctx, 5))

	conn, err := suite.subQueries.Paged(ctx, "test_user", pager.First(5, nil))
	suite.NoError(err)

	suite.Equal(5, len(conn.Edges))
	suite.Equal(int32(5), conn.TotalCount)
	suite.False(conn.PageInfo.HasNextPage)
	suite.False(conn.PageInfo.HasPreviousPage)
	suite.Equal(pager.Cursor("https://www.example.com/feed0.json"), *conn.PageInfo.StartCursor)
	suite.Equal(pager.Cursor("https://www.example.com/feed4.json"), *conn.PageInfo.EndCursor)
}

func (suite *feedsSuite) TestSubscriptionsMoreThanPage() {
	ctx := context.Background()
	suite.NoError(suite.createSubscriptions(ctx, 6))

	conn, err := suite.subQueries.Paged(ctx, "test_user", pager.First(5, nil))
	suite.NoError(err)

	suite.Equal(5, len(conn.Edges))
	suite.Equal(int32(6), conn.TotalCount)
	suite.True(conn.PageInfo.HasNextPage)
	suite.False(conn.PageInfo.HasPreviousPage)
	suite.Equal(pager.Cursor("https://www.example.com/feed0.json"), *conn.PageInfo.StartCursor)
	suite.Equal(pager.Cursor("https://www.example.com/feed4.json"), *conn.PageInfo.EndCursor)
}

func (suite *feedsSuite) TestSubscriptionsExcludeDiscarded() {
	ctx := context.Background()
	suite.NoError(suite.createSubscriptions(ctx, 4))

	conn, err := suite.subQueries.Paged(ctx, "test_user", pager.First(5, nil))
	suite.NoError(err)

	edge := conn.Edges[0].(*SubscriptionEdge)
	suite.NoError(suite.subRepo.Deactivate(ctx, "test_user", edge.ID))

	conn, err = suite.subQueries.Paged(ctx, "test_user", pager.First(5, nil))
	suite.NoError(err)

	suite.Equal(3, len(conn.Edges))
	suite.Equal(int32(3), conn.TotalCount)
	suite.False(conn.PageInfo.HasNextPage)
	suite.False(conn.PageInfo.HasPreviousPage)
	suite.Equal(pager.Cursor("https://www.example.com/feed1.json"), *conn.PageInfo.StartCursor)
	suite.Equal(pager.Cursor("https://www.example.com/feed3.json"), *conn.PageInfo.EndCursor)
}

func (suite *feedsSuite) TestSubscriptionsExcludeOtherUsers() {
	ctx := context.Background()
	suite.NoError(suite.createSubscriptions(ctx, 5))

	f, err := suite.feedRepo.GetByURL(ctx, "https://www.example.com/feed0.json")
	suite.NoError(err)

	_, err = suite.subRepo.Create(ctx, "test_user2", f.ID)
	suite.NoError(err)

	conn, err := suite.subQueries.Paged(ctx, "test_user", pager.First(5, nil))
	suite.NoError(err)

	suite.Equal(5, len(conn.Edges))
	suite.Equal(int32(5), conn.TotalCount)
	suite.False(conn.PageInfo.HasNextPage)
	suite.False(conn.PageInfo.HasPreviousPage)
	suite.Equal(pager.Cursor("https://www.example.com/feed0.json"), *conn.PageInfo.StartCursor)
	suite.Equal(pager.Cursor("https://www.example.com/feed4.json"), *conn.PageInfo.EndCursor)
}

func (suite *feedsSuite) createSubscriptions(ctx context.Context, n int) error {
	for i := 0; i < n; i++ {
		url := fmt.Sprintf("https://www.example.com/feed%d.json", i)
		feedID := feeds.NewFeedID()
		err := suite.feedRepo.Create(ctx, feedID, url)
		if err != nil {
			return err
		}

		_, err = suite.subRepo.Create(ctx, "test_user", feedID)
		if err != nil {
			return err
		}
	}
	return nil
}
