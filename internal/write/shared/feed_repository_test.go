package shared

import (
	"fmt"
	"time"

	"github.com/mjm/courier-js/internal/shared/model"
)

func (suite *dynamoSuite) TestGetFeedMissing() {
	feed, err := suite.feedRepo.Get(suite.Ctx(), "test_user", "garbage feed")
	suite.Nil(feed)
	suite.Equal(ErrNoFeed, err)
}

func (suite *dynamoSuite) TestCreateFeed() {
	feedID := model.NewFeedID()
	err := suite.feedRepo.Create(suite.Ctx(), "test_user", feedID, "https://www.example.org/feed.json")
	suite.NoError(err)

	feed, err := suite.feedRepo.Get(suite.Ctx(), "test_user", feedID)
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
	feedID := model.NewFeedID()
	err := suite.feedRepo.Create(suite.Ctx(), "test_user", feedID, "https://www.example.org/feed.json")
	suite.NoError(err)

	err = suite.feedRepo.UpdateDetails(suite.Ctx(), UpdateFeedParams{
		ID:          feedID,
		UserID:      "test_user",
		Title:       "Example Feed",
		HomePageURL: "https://www.example.org/",
		CachingHeaders: &model.CachingHeaders{
			Etag:         "etag1",
			LastModified: "blah",
		},
		MicropubEndpoint: "https://api.example.org/micropub",
	})
	suite.NoError(err)

	feed, err := suite.feedRepo.Get(suite.Ctx(), "test_user", feedID)
	suite.NoError(err)

	suite.Equal("Example Feed", feed.Title)
	suite.Equal("https://www.example.org/", feed.HomePageURL)
	suite.Equal("https://api.example.org/micropub", feed.MicropubEndpoint)
	suite.Equal(&model.CachingHeaders{
		Etag:         "etag1",
		LastModified: "blah",
	}, feed.CachingHeaders)

	err = suite.feedRepo.UpdateDetails(suite.Ctx(), UpdateFeedParams{
		ID:               feedID,
		UserID:           "test_user",
		Title:            "",
		HomePageURL:      "",
		CachingHeaders:   nil,
		MicropubEndpoint: "",
	})
	suite.NoError(err)

	feed, err = suite.feedRepo.Get(suite.Ctx(), "test_user", feedID)
	suite.NoError(err)

	suite.Equal("", feed.Title)
	suite.Equal("", feed.HomePageURL)
	suite.Equal("", feed.MicropubEndpoint)
	suite.Nil(feed.CachingHeaders)
}

func (suite *dynamoSuite) TestUpdateFeedDetailsMissing() {
	err := suite.feedRepo.UpdateDetails(suite.Ctx(), UpdateFeedParams{
		ID:          "random_feed_id",
		UserID:      "test_user",
		Title:       "Example Feed",
		HomePageURL: "https://www.example.org/",
		CachingHeaders: &model.CachingHeaders{
			Etag:         "etag1",
			LastModified: "blah",
		},
		MicropubEndpoint: "https://api.example.org/micropub",
	})
	suite.Equal(ErrNoFeed, err)
}

func (suite *dynamoSuite) TestUpdateFeedSettings() {
	feedID := model.NewFeedID()
	err := suite.feedRepo.Create(suite.Ctx(), "test_user", feedID, "https://www.example.org/feed.json")
	suite.NoError(err)

	err = suite.feedRepo.UpdateSettings(suite.Ctx(), UpdateFeedSettingsParams{
		ID:       feedID,
		UserID:   "test_user",
		Autopost: true,
	})
	suite.NoError(err)

	feed, err := suite.feedRepo.Get(suite.Ctx(), "test_user", feedID)
	suite.NoError(err)
	suite.True(feed.Autopost)

	err = suite.feedRepo.UpdateSettings(suite.Ctx(), UpdateFeedSettingsParams{
		ID:       feedID,
		UserID:   "test_user",
		Autopost: false,
	})
	suite.NoError(err)

	feed, err = suite.feedRepo.Get(suite.Ctx(), "test_user", feedID)
	suite.NoError(err)
	suite.False(feed.Autopost)
}

func (suite *dynamoSuite) TestUpdateFeedSettingsMissing() {
	err := suite.feedRepo.UpdateSettings(suite.Ctx(), UpdateFeedSettingsParams{
		ID:       "random_feed_id",
		UserID:   "test_user",
		Autopost: true,
	})
	suite.Equal(ErrNoFeed, err)
}

func (suite *dynamoSuite) TestGetFeedWithRecentPosts() {
	feedID := model.NewFeedID()
	suite.NoError(suite.feedRepo.Create(
		suite.Ctx(), "test_user", feedID, "https://www.example.org/feed.json"))

	var ps []WritePostParams
	for i := 0; i < 20; i++ {
		t := time.Date(2020, time.January, 2, 3, 4, i, 0, time.UTC)
		u := fmt.Sprintf("https://www.example.org/post/%d", i+1)
		ps = append(ps, WritePostParams{
			ID:          model.PostIDFromParts(feedID, u),
			TextContent: fmt.Sprintf("this is post #%d", i+1),
			HTMLContent: fmt.Sprintf("<p>this is post #%d</p>", i+1),
			Title:       fmt.Sprintf("Post #%d", i+1),
			URL:         u,
			PublishedAt: &t,
			ModifiedAt:  &t,
		})
	}
	suite.NoError(suite.postRepo.Write(suite.Ctx(), ps))

	feed, err := suite.feedRepo.GetWithRecentItems(suite.Ctx(), feedID, nil)
	suite.Require().NoError(err)
	suite.Require().NotNil(feed)
	suite.Require().Equal(10, len(feed.Posts))

	suite.Equal("https://www.example.org/feed.json", feed.URL)
	suite.Equal(feedID, feed.ID)
	suite.Equal("test_user", feed.UserID)

	posts := feed.Posts
	suite.Equal("Post #20", posts[0].Title)
	suite.Equal(feedID, posts[0].FeedID())
	suite.Equal("this is post #11", posts[9].TextContent)
}

func (suite *dynamoSuite) TestGetFeedWithRecentPostsAndTweets() {
	feedID := model.NewFeedID()
	suite.NoError(suite.feedRepo.Create(
		suite.Ctx(), "test_user", feedID, "https://www.example.org/feed.json"))

	var postParams []WritePostParams
	var tweetParams []CreateTweetParams
	for i := 0; i < 20; i++ {
		t := time.Date(2020, time.January, 2, 3, 4, i, 0, time.UTC)
		u := fmt.Sprintf("https://www.example.org/post/%d", i+1)
		postParams = append(postParams, WritePostParams{
			ID:          model.PostIDFromParts(feedID, u),
			TextContent: fmt.Sprintf("this is post #%d", i+1),
			HTMLContent: fmt.Sprintf("<p>this is post #%d</p>", i+1),
			Title:       fmt.Sprintf("Post #%d", i+1),
			URL:         u,
			PublishedAt: &t,
			ModifiedAt:  &t,
		})
		tweetParams = append(tweetParams, CreateTweetParams{
			ID:          model.TweetGroupIDFromParts("test_user", feedID, u),
			PublishedAt: t,
			Tweets: []*model.Tweet{
				{Body: fmt.Sprintf("this is post #%d", i+1)},
			},
		})
	}
	suite.Require().NoError(suite.postRepo.Write(suite.Ctx(), postParams))
	suite.Require().NoError(suite.tweetRepo.Create(suite.Ctx(), tweetParams))

	feed, err := suite.feedRepo.GetWithRecentItems(suite.Ctx(), feedID, nil)
	suite.Require().NoError(err)
	suite.Require().NotNil(feed)
	suite.Require().Equal(10, len(feed.Posts))

	suite.Equal("https://www.example.org/feed.json", feed.URL)
	suite.Equal(feedID, feed.ID)
	suite.Equal("test_user", feed.UserID)

	posts := feed.Posts

	suite.Equal("Post #20", posts[0].Title)
	suite.Equal(feedID, posts[0].FeedID())
	suite.NotNil(posts[0].TweetGroup)
	suite.Equal("this is post #20", posts[0].TweetGroup.Tweets[0].Body)

	suite.Equal("this is post #11", posts[9].TextContent)
	suite.NotNil(posts[9].TweetGroup)
	suite.Equal("this is post #11", posts[9].TweetGroup.Tweets[0].Body)
}

func (suite *dynamoSuite) TestGetFeedWithRecentPostsAndTweetsWithGaps() {
	feedID := model.NewFeedID()
	suite.NoError(suite.feedRepo.Create(
		suite.Ctx(), "test_user", feedID, "https://www.example.org/feed.json"))

	var postParams []WritePostParams
	var tweetParams []CreateTweetParams
	for i := 0; i < 20; i++ {
		t := time.Date(2020, time.January, 2, 3, 4, i, 0, time.UTC)
		u := fmt.Sprintf("https://www.example.org/post/%d", i+1)
		postParams = append(postParams, WritePostParams{
			ID:          model.PostIDFromParts(feedID, u),
			TextContent: fmt.Sprintf("this is post #%d", i+1),
			HTMLContent: fmt.Sprintf("<p>this is post #%d</p>", i+1),
			Title:       fmt.Sprintf("Post #%d", i+1),
			URL:         u,
			PublishedAt: &t,
			ModifiedAt:  &t,
		})

		if i < 15 {
			tweetParams = append(tweetParams, CreateTweetParams{
				ID:          model.TweetGroupIDFromParts("test_user", feedID, u),
				PublishedAt: t,
				Tweets: []*model.Tweet{
					{Body: fmt.Sprintf("this is post #%d", i+1)},
				},
			})
		}
	}
	suite.Require().NoError(suite.postRepo.Write(suite.Ctx(), postParams))
	suite.Require().NoError(suite.tweetRepo.Create(suite.Ctx(), tweetParams))

	feed, err := suite.feedRepo.GetWithRecentItems(suite.Ctx(), feedID, nil)
	suite.Require().NoError(err)
	suite.Require().NotNil(feed)
	suite.Require().Equal(10, len(feed.Posts))

	suite.Equal("https://www.example.org/feed.json", feed.URL)
	suite.Equal(feedID, feed.ID)
	suite.Equal("test_user", feed.UserID)

	posts := feed.Posts

	suite.Equal("Post #20", posts[0].Title)
	suite.Equal(feedID, posts[0].FeedID())
	suite.Nil(posts[0].TweetGroup)

	// check the boundaries
	suite.Nil(posts[4].TweetGroup)
	suite.NotNil(posts[5].TweetGroup)

	suite.Equal("this is post #11", posts[9].TextContent)
	suite.NotNil(posts[9].TweetGroup)
	suite.Equal("this is post #11", posts[9].TweetGroup.Tweets[0].Body)
}

func (suite *dynamoSuite) TestGetFeedWithRecentItemsMissing() {
	feed, err := suite.feedRepo.GetWithRecentItems(suite.Ctx(), "garbage feed", nil)
	suite.Nil(feed)
	suite.Equal(ErrNoFeed, err)
}

func (suite *dynamoSuite) TestGetFeedWithRecentItemsNoPosts() {
	feedID := model.NewFeedID()
	suite.NoError(suite.feedRepo.Create(
		suite.Ctx(), "test_user", feedID, "https://www.example.org/feed.json"))

	feed, err := suite.feedRepo.GetWithRecentItems(suite.Ctx(), feedID, nil)
	suite.Require().NoError(err)
	suite.NotNil(feed)
	suite.Equal("https://www.example.org/feed.json", feed.URL)
	suite.Empty(feed.Posts)
}
