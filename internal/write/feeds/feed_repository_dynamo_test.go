package feeds

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/feeds"
)

func (suite *dynamoSuite) TestCreateFeed() {
	ctx := context.Background()

	feedID := feeds.NewFeedIDDynamo()
	err := suite.feedRepo.Create(ctx, "test_user", feedID, "https://www.example.org/feed.json")
	suite.NoError(err)

	feed, err := suite.feedRepo.Get(ctx, "test_user", feedID)
	suite.NoError(err)
	suite.Equal("test_user", feed.UserID)
	suite.Equal(feedID, feed.ID)
	suite.Equal("https://www.example.org/feed.json", feed.URL)
	suite.Equal("", feed.Title)
	suite.Equal("", feed.HomePageURL)
	suite.Equal("", feed.MicropubEndpoint)
	suite.Nil(feed.RefreshedAt)
}

func (suite *dynamoSuite) TestUpdateFeed() {
	ctx := context.Background()

	feedID := feeds.NewFeedIDDynamo()
	err := suite.feedRepo.Create(ctx, "test_user", feedID, "https://www.example.org/feed.json")
	suite.NoError(err)

	err = suite.feedRepo.UpdateDetails(ctx, UpdateFeedParamsDynamo{
		ID:          feedID,
		UserID:      "test_user",
		Title:       "Example Feed",
		HomePageURL: "https://www.example.org/",
		CachingHeaders: &CachingHeaders{
			Etag:         "etag1",
			LastModified: "blah",
		},
		MicropubEndpoint: "https://api.example.org/micropub",
	})
	suite.NoError(err)

	feed, err := suite.feedRepo.Get(ctx, "test_user", feedID)
	suite.NoError(err)

	suite.Equal("Example Feed", feed.Title)
	suite.Equal("https://www.example.org/", feed.HomePageURL)
	suite.Equal("https://api.example.org/micropub", feed.MicropubEndpoint)
	suite.Equal(&CachingHeaders{
		Etag:         "etag1",
		LastModified: "blah",
	}, feed.CachingHeaders)

	err = suite.feedRepo.UpdateDetails(ctx, UpdateFeedParamsDynamo{
		ID:               feedID,
		UserID:           "test_user",
		Title:            "",
		HomePageURL:      "",
		CachingHeaders:   nil,
		MicropubEndpoint: "",
	})
	suite.NoError(err)

	feed, err = suite.feedRepo.Get(ctx, "test_user", feedID)
	suite.NoError(err)

	suite.Equal("", feed.Title)
	suite.Equal("", feed.HomePageURL)
	suite.Equal("", feed.MicropubEndpoint)
	suite.Nil(feed.CachingHeaders)
}

func (suite *dynamoSuite) TestUpdateFeedSettings() {
	ctx := context.Background()

	feedID := feeds.NewFeedIDDynamo()
	err := suite.feedRepo.Create(ctx, "test_user", feedID, "https://www.example.org/feed.json")
	suite.NoError(err)

	err = suite.feedRepo.UpdateSettings(ctx, UpdateFeedSettingsParams{
		ID:       feedID,
		UserID:   "test_user",
		Autopost: true,
	})
	suite.NoError(err)

	feed, err := suite.feedRepo.Get(ctx, "test_user", feedID)
	suite.NoError(err)
	suite.True(feed.Autopost)

	err = suite.feedRepo.UpdateSettings(ctx, UpdateFeedSettingsParams{
		ID:       feedID,
		UserID:   "test_user",
		Autopost: false,
	})
	suite.NoError(err)

	feed, err = suite.feedRepo.Get(ctx, "test_user", feedID)
	suite.NoError(err)
	suite.False(feed.Autopost)
}
