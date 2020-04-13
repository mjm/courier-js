package shared

import (
	"fmt"
	"time"

	"github.com/mjm/courier-js/internal/shared/feeds"
	feeds2 "github.com/mjm/courier-js/internal/write/feeds"
)

func (suite *dynamoSuite) TestCreateFeed() {
	feedID := feeds.NewFeedIDDynamo()
	err := suite.feedRepo.Create(suite.Ctx, "test_user", feedID, "https://www.example.org/feed.json")
	suite.NoError(err)

	feed, err := suite.feedRepo.Get(suite.Ctx, "test_user", feedID)
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
	feedID := feeds.NewFeedIDDynamo()
	err := suite.feedRepo.Create(suite.Ctx, "test_user", feedID, "https://www.example.org/feed.json")
	suite.NoError(err)

	err = suite.feedRepo.UpdateDetails(suite.Ctx, UpdateFeedParamsDynamo{
		ID:          feedID,
		UserID:      "test_user",
		Title:       "Example Feed",
		HomePageURL: "https://www.example.org/",
		CachingHeaders: &feeds2.CachingHeaders{
			Etag:         "etag1",
			LastModified: "blah",
		},
		MicropubEndpoint: "https://api.example.org/micropub",
	})
	suite.NoError(err)

	feed, err := suite.feedRepo.Get(suite.Ctx, "test_user", feedID)
	suite.NoError(err)

	suite.Equal("Example Feed", feed.Title)
	suite.Equal("https://www.example.org/", feed.HomePageURL)
	suite.Equal("https://api.example.org/micropub", feed.MicropubEndpoint)
	suite.Equal(&feeds2.CachingHeaders{
		Etag:         "etag1",
		LastModified: "blah",
	}, feed.CachingHeaders)

	err = suite.feedRepo.UpdateDetails(suite.Ctx, UpdateFeedParamsDynamo{
		ID:               feedID,
		UserID:           "test_user",
		Title:            "",
		HomePageURL:      "",
		CachingHeaders:   nil,
		MicropubEndpoint: "",
	})
	suite.NoError(err)

	feed, err = suite.feedRepo.Get(suite.Ctx, "test_user", feedID)
	suite.NoError(err)

	suite.Equal("", feed.Title)
	suite.Equal("", feed.HomePageURL)
	suite.Equal("", feed.MicropubEndpoint)
	suite.Nil(feed.CachingHeaders)
}

func (suite *dynamoSuite) TestUpdateFeedSettings() {
	feedID := feeds.NewFeedIDDynamo()
	err := suite.feedRepo.Create(suite.Ctx, "test_user", feedID, "https://www.example.org/feed.json")
	suite.NoError(err)

	err = suite.feedRepo.UpdateSettings(suite.Ctx, UpdateFeedSettingsParams{
		ID:       feedID,
		UserID:   "test_user",
		Autopost: true,
	})
	suite.NoError(err)

	feed, err := suite.feedRepo.Get(suite.Ctx, "test_user", feedID)
	suite.NoError(err)
	suite.True(feed.Autopost)

	err = suite.feedRepo.UpdateSettings(suite.Ctx, UpdateFeedSettingsParams{
		ID:       feedID,
		UserID:   "test_user",
		Autopost: false,
	})
	suite.NoError(err)

	feed, err = suite.feedRepo.Get(suite.Ctx, "test_user", feedID)
	suite.NoError(err)
	suite.False(feed.Autopost)
}

func (suite *dynamoSuite) TestGetFeedWithRecentPosts() {
	feedID := feeds.NewFeedIDDynamo()
	suite.NoError(suite.feedRepo.Create(
		suite.Ctx, "test_user", feedID, "https://www.example.org/feed.json"))

	var ps []WritePostParams
	for i := 0; i < 20; i++ {
		t := time.Date(2020, time.January, 2, 3, 4, i, 0, time.UTC)
		u := fmt.Sprintf("https://www.example.org/post/%d", i+1)
		ps = append(ps, WritePostParams{
			FeedID:      feedID,
			ItemID:      feeds2.PostID(u),
			TextContent: fmt.Sprintf("this is post #%d", i+1),
			HTMLContent: fmt.Sprintf("<p>this is post #%d</p>", i+1),
			Title:       fmt.Sprintf("Post #%d", i+1),
			URL:         u,
			PublishedAt: &t,
			ModifiedAt:  &t,
		})
	}
	suite.NoError(suite.postRepo.Write(suite.Ctx, ps))

	feed, posts, err := suite.feedRepo.GetWithRecentPosts(suite.Ctx, feedID)
	suite.NoError(err)
	suite.NotNil(feed)
	suite.Equal(10, len(posts))

	suite.Equal("https://www.example.org/feed.json", feed.URL)
	suite.Equal(feedID, feed.ID)
	suite.Equal("test_user", feed.UserID)

	suite.Equal("Post #20", posts[0].Title)
	suite.Equal(feedID, posts[0].FeedID)
	suite.Equal("this is post #11", posts[9].TextContent)
}
