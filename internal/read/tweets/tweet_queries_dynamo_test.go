package tweets

import (
	"time"

	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/feeds"
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

	suite.Equal(4, len(conn.Edges))
	suite.Equal(feeds.PostID("0006"), conn.Edges[0].(*TweetGroupEdge).PostID)
	suite.Equal(feeds.PostID("0001"), conn.Edges[3].(*TweetGroupEdge).PostID)
}

func (suite *dynamoSuite) TestPagedTweetsPast() {
	suite.preloadTweets()

	conn, err := suite.tweetQueries.Paged(suite.Ctx(), "test_user", PastFilter, pager.First(5, nil))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Equal(2, len(conn.Edges))
	suite.Equal(feeds.PostID("0004"), conn.Edges[0].(*TweetGroupEdge).PostID)
	suite.Equal(feeds.PostID("0003"), conn.Edges[1].(*TweetGroupEdge).PostID)
}

func (suite *dynamoSuite) preloadTweets() {
	feed1ID := feeds.NewFeedIDDynamo()
	feed2ID := feeds.NewFeedIDDynamo()

	suite.Require().NoError(
		suite.tweetRepo.Create(suite.Ctx(), "test_user", []shared.CreateTweetParams{
			{
				FeedID:      feed1ID,
				PostID:      "0001",
				PublishedAt: timeMust("2020-01-01T02:03:04Z"),
				Tweets: []*model.Tweet{
					{
						Body: "This is a tweet",
					},
				},
			},
			{
				FeedID:      feed2ID,
				PostID:      "0002",
				PublishedAt: timeMust("2020-01-02T02:03:04Z"),
				Tweets: []*model.Tweet{
					{
						Body: "This is a tweet",
					},
				},
			},
			{
				FeedID:      feed1ID,
				PostID:      "0003",
				PublishedAt: timeMust("2020-01-03T02:03:04Z"),
				Tweets: []*model.Tweet{
					{
						Body: "This is a tweet",
					},
				},
			},
			{
				FeedID:      feed2ID,
				PostID:      "0004",
				PublishedAt: timeMust("2020-01-04T02:03:04Z"),
				Tweets: []*model.Tweet{
					{
						Body: "This is a tweet",
					},
				},
			},
			{
				FeedID:      feed1ID,
				PostID:      "0005",
				PublishedAt: timeMust("2020-01-05T02:03:04Z"),
				Tweets: []*model.Tweet{
					{
						Body: "This is a tweet",
					},
				},
			},
			{
				FeedID:      feed2ID,
				PostID:      "0006",
				PublishedAt: timeMust("2020-01-06T02:03:04Z"),
				Tweets: []*model.Tweet{
					{
						Body: "This is a tweet",
					},
				},
			},
		}))

	suite.Require().NoError(suite.tweetRepo.Cancel(suite.Ctx(), "test_user", feed1ID, "0003"))
	suite.Require().NoError(suite.tweetRepo.Cancel(suite.Ctx(), "test_user", feed2ID, "0004"))
}

func timeMust(s string) time.Time {
	t, err := time.Parse(time.RFC3339, s)
	if err != nil {
		panic(err)
	}
	return t
}
