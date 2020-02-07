package feeds

import "context"

func (suite *feedsSuite) TestGetFeedDoesNotExist() {
	ctx := context.Background()
	f, err := suite.feedQueries.Get(ctx, 123)
	suite.Nil(f)
	suite.EqualError(err, "no feed found")
}

func (suite *feedsSuite) TestGetFeed() {
	ctx := context.Background()

	// create a feed
	feedID, err := suite.feedRepo.Create(ctx, "https://www.example.org/feed.json")
	suite.NoError(err)

	f, err := suite.feedQueries.Get(ctx, feedID)
	suite.NoError(err)
	suite.Equal(feedID, f.ID)
	suite.Equal("https://www.example.org/feed.json", f.URL)
}
