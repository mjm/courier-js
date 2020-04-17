package shared

import (
	"time"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
)

func (suite *dynamoSuite) TestCreateSingleTweet() {
	feedID := feeds.NewFeedIDDynamo()
	postID := feeds.PostID("https://www.example.org/post/abc")

	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx(), "test_user", []CreateTweetParams{
			{
				FeedID:      feedID,
				PostID:      postID,
				PublishedAt: t,
				Tweets: []*model.Tweet{
					{
						Body: "This is my tweet text.",
						MediaURLs: []string{
							"https://www.example.org/media/foo.jpg",
						},
					},
				},
			},
		}))

	tg, err := suite.tweetRepo.Get(suite.Ctx(), "test_user", feedID, postID)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.Equal("test_user", tg.UserID)
	suite.Equal(feedID, tg.FeedID)
	suite.Equal(postID, tg.PostID)
	suite.Equal([]*model.Tweet{
		{
			Body: "This is my tweet text.",
			MediaURLs: []string{
				"https://www.example.org/media/foo.jpg",
			},
		},
	}, tg.Tweets)
	suite.Empty(tg.RetweetID)
	suite.Equal(model.ActionTweet, tg.Action)
	suite.Equal(model.Draft, tg.Status)
	suite.NotEmpty(tg.CreatedAt)
}

func (suite *dynamoSuite) TestCreateSingleRetweet() {
	feedID := feeds.NewFeedIDDynamo()
	postID := feeds.PostID("https://www.example.org/post/abc")

	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx(), "test_user", []CreateTweetParams{
			{
				FeedID:      feedID,
				PostID:      postID,
				PublishedAt: t,
				RetweetID:   "1234567890",
			},
		}))

	tg, err := suite.tweetRepo.Get(suite.Ctx(), "test_user", feedID, postID)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.Equal("test_user", tg.UserID)
	suite.Equal(feedID, tg.FeedID)
	suite.Equal(postID, tg.PostID)
	suite.Empty(tg.Tweets)
	suite.Equal("1234567890", tg.RetweetID)
	suite.Equal(model.ActionRetweet, tg.Action)
	suite.Equal(model.Draft, tg.Status)
	suite.NotEmpty(tg.CreatedAt)
}

func (suite *dynamoSuite) TestGetTweetMissing() {
	tg, err := suite.tweetRepo.Get(suite.Ctx(), "test_user", "foo", "bar")
	suite.Equal(ErrNoTweet, err)
	suite.Nil(tg)
}

func (suite *dynamoSuite) TestCancelTweet() {
	feedID := feeds.NewFeedIDDynamo()
	postID := feeds.PostID("https://www.example.org/post/abc")

	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx(), "test_user", []CreateTweetParams{
			{
				FeedID:      feedID,
				PostID:      postID,
				PublishedAt: t,
				Tweets: []*model.Tweet{
					{
						Body: "This is my tweet text.",
						MediaURLs: []string{
							"https://www.example.org/media/foo.jpg",
						},
					},
				},
			},
		}))

	suite.Require().NoError(suite.tweetRepo.Cancel(suite.Ctx(), "test_user", feedID, postID))

	tg, err := suite.tweetRepo.Get(suite.Ctx(), "test_user", feedID, postID)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.NotNil(tg.CanceledAt)
	suite.Equal(model.Canceled, tg.Status)

	suite.Require().Equal(ErrCannotCancelOrPost, suite.tweetRepo.Cancel(suite.Ctx(), "test_user", feedID, postID))
}

func (suite *dynamoSuite) TestCancelTweetMissing() {
	err := suite.tweetRepo.Cancel(suite.Ctx(), "test_user", "whatever", "not a thing")
	suite.Equal(ErrCannotCancelOrPost, err)
}

func (suite *dynamoSuite) TestUncancelTweet() {
	feedID := feeds.NewFeedIDDynamo()
	postID := feeds.PostID("https://www.example.org/post/abc")

	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx(), "test_user", []CreateTweetParams{
			{
				FeedID:      feedID,
				PostID:      postID,
				PublishedAt: t,
				Tweets: []*model.Tweet{
					{
						Body: "This is my tweet text.",
						MediaURLs: []string{
							"https://www.example.org/media/foo.jpg",
						},
					},
				},
			},
		}))

	suite.Require().NoError(suite.tweetRepo.Cancel(suite.Ctx(), "test_user", feedID, postID))
	suite.Require().NoError(suite.tweetRepo.Uncancel(suite.Ctx(), "test_user", feedID, postID))

	tg, err := suite.tweetRepo.Get(suite.Ctx(), "test_user", feedID, postID)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.Nil(tg.CanceledAt)
	suite.Equal(model.Draft, tg.Status)
}

func (suite *dynamoSuite) TestUncancelTweetMissing() {
	err := suite.tweetRepo.Uncancel(suite.Ctx(), "test_user", "whatever", "not a thing")
	suite.Equal(ErrCannotUncancel, err)
}

func (suite *dynamoSuite) TestPostTweet() {
	feedID := feeds.NewFeedIDDynamo()
	postID := feeds.PostID("https://www.example.org/post/abc")

	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx(), "test_user", []CreateTweetParams{
			{
				FeedID:      feedID,
				PostID:      postID,
				PublishedAt: t,
				Tweets: []*model.Tweet{
					{
						Body: "This is my tweet text.",
						MediaURLs: []string{
							"https://www.example.org/media/foo.jpg",
						},
					},
				},
			},
		}))

	suite.Require().NoError(suite.tweetRepo.Post(suite.Ctx(), "test_user", feedID, postID, []int64{1234567890}))

	tg, err := suite.tweetRepo.Get(suite.Ctx(), "test_user", feedID, postID)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.NotNil(tg.PostedAt)
	suite.Equal(model.Posted, tg.Status)
	suite.Equal("1234567890", tg.Tweets[0].PostedTweetID)
}
