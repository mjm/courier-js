package feeds

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/feeds"
)

func (suite *feedsSuite) TestGetFeedDoesNotExist() {
	ctx := context.Background()
	id := feeds.NewFeedID()
	f, err := suite.feedQueries.Get(ctx, id)
	suite.Nil(f)
	suite.EqualError(err, "no feed found")
}

func (suite *feedsSuite) TestGetFeed() {
	ctx := context.Background()

	// create a feed
	feedID := feeds.NewFeedID()
	err := suite.feedRepo.Create(ctx, feedID, "https://www.example.org/feed.json")
	suite.NoError(err)

	f, err := suite.feedQueries.Get(ctx, feedID)
	suite.NoError(err)
	suite.Equal(feedID, f.ID)
	suite.Equal("https://www.example.org/feed.json", f.URL)
}
