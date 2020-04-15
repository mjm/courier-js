package feeds

import (
	"fmt"

	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/write/shared"
)

func (suite *dynamoSuite) TestPagedFeedsEmpty() {
	conn, err := suite.feedQueries.Paged(suite.Ctx(), "test_user", pager.First(10, nil))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Empty(conn.Edges)
	suite.False(conn.PageInfo.HasNextPage)
	suite.Nil(conn.PageInfo.StartCursor)
	suite.Nil(conn.PageInfo.EndCursor)
}

func (suite *dynamoSuite) TestPagedFeeds() {
	suite.preloadFeeds(8)

	conn, err := suite.feedQueries.Paged(suite.Ctx(), "test_user", pager.First(5, nil))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Equal(5, len(conn.Edges))
	suite.True(conn.PageInfo.HasNextPage)
	suite.Equal("Feed #1", conn.Edges[0].(*FeedEdge).Title)
	suite.Equal("Feed #5", conn.Edges[4].(*FeedEdge).Title)

	conn, err = suite.feedQueries.Paged(suite.Ctx(), "test_user", pager.First(5, conn.PageInfo.EndCursor))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Equal(3, len(conn.Edges))
	suite.False(conn.PageInfo.HasNextPage)
	suite.Equal("Feed #6", conn.Edges[0].(*FeedEdge).Title)
	suite.Equal("Feed #8", conn.Edges[2].(*FeedEdge).Title)
}

func (suite *dynamoSuite) preloadFeeds(n int) {
	for i := 1; i <= n; i++ {
		id := feeds.NewFeedIDDynamo()
		u := fmt.Sprintf("https://www.example.org/feed%d.json", i)
		suite.NoError(suite.feedRepo.Create(suite.Ctx(), "test_user", id, u))
		suite.NoError(suite.feedRepo.UpdateDetails(suite.Ctx(), shared.UpdateFeedParamsDynamo{
			ID:          id,
			UserID:      "test_user",
			Title:       fmt.Sprintf("Feed #%d", i),
			HomePageURL: "https://www.example.org/",
		}))
	}
}
