package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/tweets"
)

func (suite *tweetsSuite) TestCancelCommand() {
	suite.collectEvents(tweets.TweetCanceled{})
	ctx := context.Background()

	cmd := CancelCommand{
		UserID:  "test_user3",
		TweetID: "398042cc-d2f6-4d91-bd81-a5a4f19f7746",
	}
	_, err := suite.commandBus.Run(ctx, cmd)
	suite.NoError(err)

	suite.Equal([]interface{}{
		tweets.TweetCanceled{
			UserId:  "test_user3",
			TweetId: "398042cc-d2f6-4d91-bd81-a5a4f19f7746",
		},
	}, suite.eventCollector.Events)
}

func (suite *tweetsSuite) TestCancelCommandFails() {
	suite.collectEvents(tweets.TweetCanceled{})
	ctx := context.Background()

	cmd := CancelCommand{
		UserID:  "test_user3",
		TweetID: "ea2f9dc0-8701-485e-9b2b-0d9b9e7d244f",
	}
	_, err := suite.commandBus.Run(ctx, cmd)
	suite.EqualError(err, "no tweet found")

	suite.Empty(suite.eventCollector.Events)
}
