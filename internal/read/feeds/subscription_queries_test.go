package feeds

import (
	"context"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/write/feeds"
)

func (suite *feedsSuite) TestGetSubscriptionDoesNotExist() {
	ctx := auth.WithMockUser(context.Background(), "test_user")
	sub, err := suite.subQueries.Get(ctx, feeds.NewFeedSubscriptionID())
	suite.Nil(sub)
	suite.EqualError(err, "no feed subscription found")
}

func (suite *feedsSuite) TestGetSubscription() {
	ctx := auth.WithMockUser(context.Background(), "test_user")

	feedID := feeds.NewFeedID()
	err := suite.feedRepo.Create(ctx, feedID, "https://www.example.org/feeds.json")
	suite.NoError(err)
	subID, err := suite.subRepo.Create(ctx, "test_user", feedID)
	suite.NoError(err)

	sub, err := suite.subQueries.Get(ctx, subID)
	suite.NoError(err)
	suite.Equal("test_user", sub.UserID)
	suite.Equal(feedID, sub.FeedID)
	suite.Equal(subID, sub.ID)
	suite.False(sub.Autopost)
}

func (suite *feedsSuite) TestGetSubscriptionOtherUser() {
	ctx := auth.WithMockUser(context.Background(), "test_user")

	feedID := feeds.NewFeedID()
	err := suite.feedRepo.Create(ctx, feedID, "https://www.example.org/feeds.json")
	suite.NoError(err)
	subID, err := suite.subRepo.Create(ctx, "test_user2", feedID)
	suite.NoError(err)

	sub, err := suite.subQueries.Get(ctx, subID)
	suite.Nil(sub)
	suite.EqualError(err, "no feed subscription found")
}

func (suite *feedsSuite) TestGetSubscriptionEdge() {
	ctx := auth.WithMockUser(context.Background(), "test_user")

	feedID := feeds.NewFeedID()
	err := suite.feedRepo.Create(ctx, feedID, "https://www.example.org/feeds.json")
	suite.NoError(err)
	subID, err := suite.subRepo.Create(ctx, "test_user", feedID)
	suite.NoError(err)

	edge, err := suite.subQueries.GetEdge(ctx, subID)
	suite.NoError(err)
	suite.Equal("test_user", edge.UserID)
	suite.Equal(feedID, edge.FeedID)
	suite.Equal(subID, edge.ID)
	suite.False(edge.Autopost)
	suite.Equal(pager.Cursor("https://www.example.org/feeds.json"), edge.Cursor())
}
