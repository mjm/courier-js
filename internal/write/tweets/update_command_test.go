package tweets

import (
	"context"

	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/shared/tweets"
)

func (suite *tweetsSuite) TestUpdateCommand() {
	suite.collectEvents(tweets.TweetEdited{}, tweets.TweetsUpdated{})
	ctx := context.Background()

	cmd := UpdateCommand{
		UserID:  "test_user3",
		TweetID: "398042cc-d2f6-4d91-bd81-a5a4f19f7746",
		Body:    "My edited tweet content",
		MediaURLs: []string{
			"https://example.com/media/1234.jpg",
			"https://example.com/media/5678.gif",
		},
	}
	_, err := suite.commandBus.Run(ctx, cmd)
	suite.NoError(err)

	// check that the tweet was updated
	tweet, err := suite.tweetRepo.Get(ctx, "test_user3", "398042cc-d2f6-4d91-bd81-a5a4f19f7746")
	suite.NoError(err)
	suite.Equal("My edited tweet content", tweet.Body)
	suite.Equal(pq.StringArray{
		"https://example.com/media/1234.jpg",
		"https://example.com/media/5678.gif",
	}, tweet.MediaURLs)

	suite.Equal([]interface{}{
		tweets.TweetEdited{
			UserID:  "test_user3",
			TweetID: "398042cc-d2f6-4d91-bd81-a5a4f19f7746",
		},
		tweets.TweetsUpdated{
			TweetsImported: tweets.TweetsImported{
				UserID:         "test_user3",
				SubscriptionID: "4b033437-c2a8-4775-b303-2764f2d73c31",
				TweetIDs:       []TweetID{"398042cc-d2f6-4d91-bd81-a5a4f19f7746"},
			},
		},
	}, suite.eventCollector.Events)
}

func (suite *tweetsSuite) TestUpdateCommandMediaUnchanged() {
	suite.collectEvents(tweets.TweetEdited{}, tweets.TweetsUpdated{})
	ctx := context.Background()

	cmd := UpdateCommand{
		UserID:  "test_user3",
		TweetID: "be94e030-6062-439f-8c73-3b24c08e6b5f",
		Body:    "My edited tweet content",
	}
	_, err := suite.commandBus.Run(ctx, cmd)
	suite.NoError(err)

	// check that the tweet was updated
	tweet, err := suite.tweetRepo.Get(ctx, "test_user3", "be94e030-6062-439f-8c73-3b24c08e6b5f")
	suite.NoError(err)
	suite.Equal("My edited tweet content", tweet.Body)
	suite.Equal(pq.StringArray{
		"https://example.com/media/foobar.jpg",
	}, tweet.MediaURLs)

	suite.Equal([]interface{}{
		tweets.TweetEdited{
			UserID:  "test_user3",
			TweetID: "be94e030-6062-439f-8c73-3b24c08e6b5f",
		},
		tweets.TweetsUpdated{
			TweetsImported: tweets.TweetsImported{
				UserID:         "test_user3",
				SubscriptionID: "4b033437-c2a8-4775-b303-2764f2d73c31",
				TweetIDs:       []TweetID{"be94e030-6062-439f-8c73-3b24c08e6b5f"},
			},
		},
	}, suite.eventCollector.Events)
}

func (suite *tweetsSuite) TestUpdateCommandNonDraft() {
	suite.collectEvents(tweets.TweetEdited{}, tweets.TweetsUpdated{})
	ctx := context.Background()

	cmd := UpdateCommand{
		UserID:  "test_user3",
		TweetID: "ea2f9dc0-8701-485e-9b2b-0d9b9e7d244f",
		Body:    "My edited tweet content",
		MediaURLs: []string{
			"https://example.com/media/1234.jpg",
			"https://example.com/media/5678.gif",
		},
	}
	_, err := suite.commandBus.Run(ctx, cmd)
	suite.EqualError(err, "tweet is not a draft")

	suite.Nil(suite.eventCollector.Events)
}

func (suite *tweetsSuite) TestUpdateCommandRetweet() {
	suite.collectEvents(tweets.TweetEdited{}, tweets.TweetsUpdated{})
	ctx := context.Background()

	cmd := UpdateCommand{
		UserID:  "test_user3",
		TweetID: "5fea0b11-0264-4ebe-8cd6-1854ddf151ad",
		Body:    "My edited tweet content",
		MediaURLs: []string{
			"https://example.com/media/1234.jpg",
			"https://example.com/media/5678.gif",
		},
	}
	_, err := suite.commandBus.Run(ctx, cmd)
	suite.EqualError(err, "cannot edit retweet")

	suite.Nil(suite.eventCollector.Events)
}
