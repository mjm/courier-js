package shared

import (
	"time"

	"github.com/mjm/courier-js/internal/shared/model"
)

func (suite *dynamoSuite) TestCreateSingleTweet() {
	id := model.TweetGroupIDFromParts("test_user", model.NewFeedID(), "https://www.example.org/post/abc")
	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx(), []CreateTweetParams{
			{
				ID:          id,
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

	tg, err := suite.tweetRepo.Get(suite.Ctx(), id)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.Equal("test_user", tg.UserID())
	suite.Equal(id.FeedID, tg.FeedID())
	suite.Equal(id.ItemID, tg.ItemID())
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
	id := model.TweetGroupIDFromParts("test_user", model.NewFeedID(), "https://www.example.org/post/abc")
	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx(), []CreateTweetParams{
			{
				ID:          id,
				PublishedAt: t,
				RetweetID:   "1234567890",
			},
		}))

	tg, err := suite.tweetRepo.Get(suite.Ctx(), id)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.Equal("test_user", tg.UserID())
	suite.Equal(id.FeedID, tg.FeedID())
	suite.Equal(id.ItemID, tg.ItemID())
	suite.Empty(tg.Tweets)
	suite.Equal("1234567890", tg.RetweetID)
	suite.Equal(model.ActionRetweet, tg.Action)
	suite.Equal(model.Draft, tg.Status)
	suite.NotEmpty(tg.CreatedAt)
}

func (suite *dynamoSuite) TestUpdateTweet() {
	id := model.TweetGroupIDFromParts("test_user", model.NewFeedID(), "https://www.example.org/post/abc")
	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx(), []CreateTweetParams{
			{
				ID:          id,
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
			{
				ID:          model.TweetGroupIDFromParts(id.UserID, id.FeedID, "abc123"),
				PublishedAt: t.Add(time.Hour),
				Tweets: []*model.Tweet{
					{
						Body: "This is a different tweet",
					},
				},
			},
		}))

	suite.Require().NoError(
		suite.tweetRepo.Update(suite.Ctx(), UpdateTweetParams{
			ID:        id,
			RetweetID: "123456",
		}))

	tg, err := suite.tweetRepo.Get(suite.Ctx(), id)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.Equal(model.Draft, tg.Status)
	suite.Equal(model.ActionRetweet, tg.Action)
	suite.Equal("123456", tg.RetweetID)
	suite.Empty(tg.Tweets)

	suite.Require().NoError(
		suite.tweetRepo.Update(suite.Ctx(), UpdateTweetParams{
			ID: id,
			Tweets: []*model.Tweet{
				{
					Body: "This is some new tweet content.",
				},
				{
					Body:      "This is another tweet.",
					MediaURLs: []string{"https://example.org/foo.jpg"},
				},
			},
		}))

	tg, err = suite.tweetRepo.Get(suite.Ctx(), id)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.Equal(model.Draft, tg.Status)
	suite.Equal([]*model.Tweet{
		{
			Body: "This is some new tweet content.",
		},
		{
			Body:      "This is another tweet.",
			MediaURLs: []string{"https://example.org/foo.jpg"},
		},
	}, tg.Tweets)
	suite.Empty(tg.RetweetID)
}

func (suite *dynamoSuite) TestGetTweetMissing() {
	id := model.TweetGroupIDFromParts("test_user", "foo", "bar")
	tg, err := suite.tweetRepo.Get(suite.Ctx(), id)
	suite.Equal(ErrNoTweet, err)
	suite.Nil(tg)
}

func (suite *dynamoSuite) TestCancelTweet() {
	id := model.TweetGroupIDFromParts("test_user", model.NewFeedID(), "https://www.example.org/post/abc")
	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx(), []CreateTweetParams{
			{
				ID:          id,
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

	suite.Require().NoError(suite.tweetRepo.Cancel(suite.Ctx(), id))

	tg, err := suite.tweetRepo.Get(suite.Ctx(), id)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.NotNil(tg.CanceledAt)
	suite.Equal(model.Canceled, tg.Status)

	suite.Require().Equal(ErrCannotCancelOrPost, suite.tweetRepo.Cancel(suite.Ctx(), id))
}

func (suite *dynamoSuite) TestCancelTweetMissing() {
	id := model.TweetGroupIDFromParts("test_user", "whatever", "not a thing")
	err := suite.tweetRepo.Cancel(suite.Ctx(), id)
	suite.Equal(ErrCannotCancelOrPost, err)
}

func (suite *dynamoSuite) TestUncancelTweet() {
	id := model.TweetGroupIDFromParts("test_user", model.NewFeedID(), "https://www.example.org/post/abc")
	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx(), []CreateTweetParams{
			{
				ID:          id,
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

	suite.Require().NoError(suite.tweetRepo.Cancel(suite.Ctx(), id))
	suite.Require().NoError(suite.tweetRepo.Uncancel(suite.Ctx(), id))

	tg, err := suite.tweetRepo.Get(suite.Ctx(), id)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.Nil(tg.CanceledAt)
	suite.Equal(model.Draft, tg.Status)
}

func (suite *dynamoSuite) TestUncancelTweetMissing() {
	id := model.TweetGroupIDFromParts("test_user", "whatever", "not a thing")
	err := suite.tweetRepo.Uncancel(suite.Ctx(), id)
	suite.Equal(ErrCannotUncancel, err)
}

func (suite *dynamoSuite) TestPostTweet() {
	id := model.TweetGroupIDFromParts("test_user", model.NewFeedID(), "https://www.example.org/post/abc")
	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx(), []CreateTweetParams{
			{
				ID:          id,
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

	suite.Require().NoError(suite.tweetRepo.Post(suite.Ctx(), id, []int64{1234567890}))

	tg, err := suite.tweetRepo.Get(suite.Ctx(), id)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.NotNil(tg.PostedAt)
	suite.Equal(model.Posted, tg.Status)
	suite.Equal("1234567890", tg.Tweets[0].PostedTweetID)
}
