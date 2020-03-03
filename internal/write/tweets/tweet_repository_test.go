package tweets

import (
	"context"

	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/shared/feeds"
)

func (suite *tweetsSuite) TestGetTweet() {
	ctx := context.Background()
	tweet, err := suite.tweetRepo.Get(ctx, "test_user", "df850b2a-a4c1-4e51-95ea-5e0ad456310f")
	suite.NoError(err)

	suite.Equal(TweetID("df850b2a-a4c1-4e51-95ea-5e0ad456310f"), tweet.ID)
	suite.Equal(feeds.SubscriptionID("e9749df4-56d3-4716-a78f-2c00c38b9bdb"), tweet.FeedSubscriptionID)
	suite.Equal(feeds.PostID("4a5fc152-1b2a-40eb-969f-8b1473cd28f2"), tweet.PostID)
	suite.Equal("This is my first example post", tweet.Body)
	suite.Equal(pq.StringArray{}, tweet.MediaURLs)
	suite.Equal(Draft, tweet.Status)
	suite.Equal(ActionTweet, tweet.Action)
}

func (suite *tweetsSuite) TestGetTweetOtherUser() {
	ctx := context.Background()
	tweet, err := suite.tweetRepo.Get(ctx, "test_user2", "df850b2a-a4c1-4e51-95ea-5e0ad456310f")
	suite.Nil(tweet)
	suite.Equal(err, ErrNoTweet)
}

func (suite *tweetsSuite) TestGetTweetNonexistent() {
	ctx := context.Background()
	tweet, err := suite.tweetRepo.Get(ctx, "test_user", "72a8b302-7e84-42ab-a8d3-037f56d616db")
	suite.Nil(tweet)
	suite.Equal(err, ErrNoTweet)
}

func (suite *tweetsSuite) TestTweetsByPostIDs() {
	ctx := context.Background()
	postIDs := []feeds.PostID{
		"f536e1b2-ddaa-49fa-97e7-6065714660a3",
		"4a5fc152-1b2a-40eb-969f-8b1473cd28f2",
	}
	byPostID, err := suite.tweetRepo.ByPostIDs(ctx, "e9749df4-56d3-4716-a78f-2c00c38b9bdb", postIDs)
	suite.NoError(err)
	suite.Equal(1, len(byPostID))

	// no tweets found for this post
	suite.Nil(byPostID[feeds.PostID("f536e1b2-ddaa-49fa-97e7-6065714660a3")])

	tweets := byPostID[feeds.PostID("4a5fc152-1b2a-40eb-969f-8b1473cd28f2")]
	suite.Equal(1, len(tweets))
	suite.Equal(TweetID("df850b2a-a4c1-4e51-95ea-5e0ad456310f"), tweets[0].ID)
}

func (suite *tweetsSuite) TestCancelTweet() {
	ctx := context.Background()
	suite.NoError(suite.tweetRepo.Cancel(ctx, "test_user", "df850b2a-a4c1-4e51-95ea-5e0ad456310f"))

	tweet, err := suite.tweetRepo.Get(ctx, "test_user", "df850b2a-a4c1-4e51-95ea-5e0ad456310f")
	suite.NoError(err)
	suite.Equal(Canceled, tweet.Status)
}

func (suite *tweetsSuite) TestCancelTweetNonexistent() {
	ctx := context.Background()
	err := suite.tweetRepo.Cancel(ctx, "test_user3", "9460cce6-83e8-4f18-8823-92e503ac655d")
	suite.Equal(err, ErrNoTweet)
}

func (suite *tweetsSuite) TestCancelTweetAlreadyCanceled() {
	ctx := context.Background()
	err := suite.tweetRepo.Cancel(ctx, "test_user3", "ea2f9dc0-8701-485e-9b2b-0d9b9e7d244f")
	suite.Equal(err, ErrNoTweet)
}

func (suite *tweetsSuite) TestCancelTweetAlreadyPosted() {
	ctx := context.Background()
	err := suite.tweetRepo.Cancel(ctx, "test_user3", "7f297943-854e-4e59-abe2-b377fde9aa12")
	suite.Equal(err, ErrNoTweet)

	tweet, err := suite.tweetRepo.Get(ctx, "test_user3", "7f297943-854e-4e59-abe2-b377fde9aa12")
	suite.NoError(err)
	suite.Equal(Posted, tweet.Status)
}

func (suite *tweetsSuite) TestUncancelTweet() {
	ctx := context.Background()
	suite.NoError(suite.tweetRepo.Uncancel(ctx, "test_user3", "ea2f9dc0-8701-485e-9b2b-0d9b9e7d244f"))

	tweet, err := suite.tweetRepo.Get(ctx, "test_user3", "ea2f9dc0-8701-485e-9b2b-0d9b9e7d244f")
	suite.NoError(err)
	suite.Equal(Draft, tweet.Status)
}

func (suite *tweetsSuite) TestUncancelTweetNonexistent() {
	ctx := context.Background()
	err := suite.tweetRepo.Uncancel(ctx, "test_user3", "9460cce6-83e8-4f18-8823-92e503ac655d")
	suite.Equal(err, ErrNoTweet)
}

func (suite *tweetsSuite) TestUncancelTweetDraft() {
	ctx := context.Background()
	err := suite.tweetRepo.Uncancel(ctx, "test_user3", "398042cc-d2f6-4d91-bd81-a5a4f19f7746")
	suite.Equal(err, ErrNoTweet)
}

func (suite *tweetsSuite) TestUncancelTweetPosted() {
	ctx := context.Background()
	err := suite.tweetRepo.Uncancel(ctx, "test_user3", "7f297943-854e-4e59-abe2-b377fde9aa12")
	suite.Equal(err, ErrNoTweet)

	tweet, err := suite.tweetRepo.Get(ctx, "test_user3", "7f297943-854e-4e59-abe2-b377fde9aa12")
	suite.NoError(err)
	suite.Equal(Posted, tweet.Status)
}

func (suite *tweetsSuite) TestPostTweet() {
	ctx := context.Background()
	suite.NoError(suite.tweetRepo.Post(ctx, "398042cc-d2f6-4d91-bd81-a5a4f19f7746", 123456))

	tweet, err := suite.tweetRepo.Get(ctx, "test_user3", "398042cc-d2f6-4d91-bd81-a5a4f19f7746")
	suite.NoError(err)
	suite.Equal(Posted, tweet.Status)
	suite.Equal("123456", tweet.PostedTweetID)
	suite.True(tweet.PostedAt.Valid)
}

func (suite *tweetsSuite) TestPostTweetNonexistent() {
	ctx := context.Background()
	err := suite.tweetRepo.Post(ctx, "9460cce6-83e8-4f18-8823-92e503ac655d", 123456)
	suite.Equal(err, ErrNoTweet)
}

func (suite *tweetsSuite) TestPostTweetAlreadyPosted() {
	ctx := context.Background()
	err := suite.tweetRepo.Post(ctx, "7f297943-854e-4e59-abe2-b377fde9aa12", 123456)
	suite.Equal(err, ErrNoTweet)

	tweet, err := suite.tweetRepo.Get(ctx, "test_user3", "7f297943-854e-4e59-abe2-b377fde9aa12")
	suite.NoError(err)
	suite.Equal(Posted, tweet.Status)
	suite.Equal("1234567890", tweet.PostedTweetID)
	suite.True(tweet.PostedAt.Valid)
}

func (suite *tweetsSuite) TestPostTweetCanceled() {
	ctx := context.Background()
	err := suite.tweetRepo.Post(ctx, "ea2f9dc0-8701-485e-9b2b-0d9b9e7d244f", 123456)
	suite.Equal(err, ErrNoTweet)

	tweet, err := suite.tweetRepo.Get(ctx, "test_user3", "ea2f9dc0-8701-485e-9b2b-0d9b9e7d244f")
	suite.NoError(err)
	suite.Equal(Canceled, tweet.Status)
	suite.Empty(tweet.PostedTweetID)
	suite.False(tweet.PostedAt.Valid)
}
