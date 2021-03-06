package tweets

import (
	"time"

	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/write/shared"
)

func (suite *dynamoSuite) TestPagedTweetsEmpty() {
	conn, err := suite.tweetQueries.Paged(suite.Ctx(), "test_user", UpcomingFilter, pager.First(10, nil))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Empty(conn.Edges)
}

func (suite *dynamoSuite) TestPagedTweetsUpcoming() {
	suite.preloadTweets()

	conn, err := suite.tweetQueries.Paged(suite.Ctx(), "test_user", UpcomingFilter, pager.First(5, nil))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Equal(3, len(conn.Edges))
	suite.Equal("0006", conn.Edges[0].(*TweetGroupEdge).ItemID())
	suite.Equal("0001", conn.Edges[2].(*TweetGroupEdge).ItemID())

	c := conn.Edges[1].Cursor()
	conn, err = suite.tweetQueries.Paged(suite.Ctx(), "test_user", UpcomingFilter, pager.First(3, &c))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)
}

func (suite *dynamoSuite) TestPagedTweetsPast() {
	suite.preloadTweets()

	conn, err := suite.tweetQueries.Paged(suite.Ctx(), "test_user", PastFilter, pager.First(5, nil))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Equal(3, len(conn.Edges))
	suite.Equal("0005", conn.Edges[0].(*TweetGroupEdge).ItemID())
	suite.Equal("0003", conn.Edges[2].(*TweetGroupEdge).ItemID())
}

func (suite *dynamoSuite) TestPagedTweetsUncanceled() {
	suite.preloadTweets()

	suite.Require().NoError(suite.tweetRepo.Uncancel(suite.Ctx(), model.TweetGroupIDFromParts("test_user", "feed2", "0004")))

	conn, err := suite.tweetQueries.Paged(suite.Ctx(), "test_user", PastFilter, pager.First(5, nil))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Equal(2, len(conn.Edges))
	suite.Equal("0003", conn.Edges[1].(*TweetGroupEdge).ItemID())

	conn, err = suite.tweetQueries.Paged(suite.Ctx(), "test_user", UpcomingFilter, pager.First(5, nil))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Equal(4, len(conn.Edges))
	suite.Equal("0004", conn.Edges[1].(*TweetGroupEdge).ItemID())
}

func (suite *dynamoSuite) preloadTweets() {
	feed1ID := model.FeedID("feed1")
	feed2ID := model.FeedID("feed2")

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx(), []shared.CreateTweetParams{
			{
				ID:          model.TweetGroupIDFromParts("test_user", feed1ID, "0001"),
				PublishedAt: timeMust("2020-01-01T02:03:04Z"),
				Tweets: []*model.Tweet{
					{
						Body: "This is a tweet",
					},
				},
			},
			{
				ID:          model.TweetGroupIDFromParts("test_user", feed2ID, "0002"),
				PublishedAt: timeMust("2020-01-02T02:03:04Z"),
				Tweets: []*model.Tweet{
					{
						Body: "This is a tweet",
					},
				},
			},
			{
				ID:          model.TweetGroupIDFromParts("test_user", feed1ID, "0003"),
				PublishedAt: timeMust("2020-01-03T02:03:04Z"),
				Tweets: []*model.Tweet{
					{
						Body: "This is a tweet",
					},
				},
			},
			{
				ID:          model.TweetGroupIDFromParts("test_user", feed2ID, "0004"),
				PublishedAt: timeMust("2020-01-04T02:03:04Z"),
				Tweets: []*model.Tweet{
					{
						Body: "This is a tweet",
					},
				},
			},
			{
				ID:          model.TweetGroupIDFromParts("test_user", feed1ID, "0005"),
				PublishedAt: timeMust("2020-01-05T02:03:04Z"),
				Tweets: []*model.Tweet{
					{
						Body: "This is a tweet",
					},
				},
			},
			{
				ID:          model.TweetGroupIDFromParts("test_user", feed2ID, "0006"),
				PublishedAt: timeMust("2020-01-06T02:03:04Z"),
				Tweets: []*model.Tweet{
					{
						Body: "This is a tweet",
					},
				},
			},
		}))

	suite.Require().NoError(suite.tweetRepo.Cancel(suite.Ctx(), model.TweetGroupIDFromParts("test_user", feed1ID, "0003")))
	suite.clock.Advance(time.Minute)
	suite.Require().NoError(suite.tweetRepo.Cancel(suite.Ctx(), model.TweetGroupIDFromParts("test_user", feed2ID, "0004")))
	suite.clock.Advance(time.Minute)
	suite.Require().NoError(suite.tweetRepo.Post(suite.Ctx(), model.TweetGroupIDFromParts("test_user", feed1ID, "0005"), []int64{1234}))
}

func timeMust(s string) time.Time {
	t, err := time.Parse(time.RFC3339, s)
	if err != nil {
		panic(err)
	}
	return t
}
