package shared

import (
	"time"

	"github.com/mjm/courier-js/internal/shared/feeds"
)

func (suite *dynamoSuite) TestCreateSingleTweet() {
	feedID := feeds.NewFeedIDDynamo()
	postID := feeds.PostID("https://www.example.org/post/abc")

	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx, "test_user", []CreateTweetParams{
			{
				FeedID:      feedID,
				PostID:      postID,
				PublishedAt: t,
				Tweets: []*Tweet{
					{
						Body: "This is my tweet text.",
						MediaURLs: []string{
							"https://www.example.org/media/foo.jpg",
						},
					},
				},
			},
		}))

	tg, err := suite.tweetRepo.Get(suite.Ctx, "test_user", feedID, postID)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.Equal("test_user", tg.UserID)
	suite.Equal(feedID, tg.FeedID)
	suite.Equal(postID, tg.PostID)
	suite.Equal([]*Tweet{
		{
			Body: "This is my tweet text.",
			MediaURLs: []string{
				"https://www.example.org/media/foo.jpg",
			},
		},
	}, tg.Tweets)
	suite.Empty(tg.RetweetID)
	suite.Equal(ActionTweet, tg.Action)
	suite.Equal(Draft, tg.Status)
	suite.NotEmpty(tg.CreatedAt)
}

func (suite *dynamoSuite) TestCreateSingleRetweet() {
	feedID := feeds.NewFeedIDDynamo()
	postID := feeds.PostID("https://www.example.org/post/abc")

	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx, "test_user", []CreateTweetParams{
			{
				FeedID:      feedID,
				PostID:      postID,
				PublishedAt: t,
				RetweetID:   "1234567890",
			},
		}))

	tg, err := suite.tweetRepo.Get(suite.Ctx, "test_user", feedID, postID)
	suite.Require().NoError(err)
	suite.Require().NotNil(tg)

	suite.Equal("test_user", tg.UserID)
	suite.Equal(feedID, tg.FeedID)
	suite.Equal(postID, tg.PostID)
	suite.Empty(tg.Tweets)
	suite.Equal("1234567890", tg.RetweetID)
	suite.Equal(ActionRetweet, tg.Action)
	suite.Equal(Draft, tg.Status)
	suite.NotEmpty(tg.CreatedAt)

}
