package user

import (
	"context"
	"fmt"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/tweets"
)

func (suite *userSuite) TestRecordEvents() {
	truth := true

	tests := []struct {
		evt      interface{}
		expected *Event
	}{
		{
			evt: feeds.FeedSubscribed{
				FeedID:         "feed_1",
				SubscriptionID: "feed_subscription_2",
				UserID:         "test_user",
			},
			expected: &Event{
				UserID:    "test_user",
				EventType: FeedSubscribe,
				Params: EventParams{
					FeedID:             "feed_1",
					FeedSubscriptionID: "feed_subscription_2",
				},
			},
		},
		{
			evt: feeds.FeedRefreshed{
				FeedID: "feed_2",
				UserID: "test_user",
			},
			expected: &Event{
				UserID:    "test_user",
				EventType: FeedRefresh,
				Params: EventParams{
					FeedID: "feed_2",
				},
			},
		},
		{
			evt: feeds.FeedOptionsChanged{
				SubscriptionID: "feed_subscription_1",
				UserID:         "test_user",
				Autopost:       true,
			},
			expected: &Event{
				UserID:    "test_user",
				EventType: FeedSetAutopost,
				Params: EventParams{
					FeedSubscriptionID: "feed_subscription_1",
					ParamValue:         &truth,
				},
			},
		},
		{
			evt: feeds.FeedUnsubscribed{
				SubscriptionID: "feed_subscription_3",
				UserID:         "test_user",
			},
			expected: &Event{
				UserID:    "test_user",
				EventType: FeedUnsubscribe,
				Params: EventParams{
					FeedSubscriptionID: "feed_subscription_3",
				},
			},
		},
		{
			evt: tweets.TweetCanceled{
				UserID:  "test_user",
				TweetID: "tweet_1",
			},
			expected: &Event{
				UserID:    "test_user",
				EventType: TweetCancel,
				Params: EventParams{
					TweetID: "tweet_1",
				},
			},
		},
		{
			evt: tweets.TweetUncanceled{
				UserID:  "test_user",
				TweetID: "tweet_1",
			},
			expected: &Event{
				UserID:    "test_user",
				EventType: TweetUncancel,
				Params: EventParams{
					TweetID: "tweet_1",
				},
			},
		},
		{
			evt: tweets.TweetEdited{
				UserID:  "test_user",
				TweetID: "tweet_1",
			},
			expected: &Event{
				UserID:    "test_user",
				EventType: TweetEdit,
				Params: EventParams{
					TweetID: "tweet_1",
				},
			},
		},
	}

	ctx := context.Background()
	NewEventRecorder(suite.db, suite.eventBus)

	for _, test := range tests {
		suite.Run(fmt.Sprintf("%T", test.evt), func() {
			suite.eventBus.Fire(ctx, test.evt)

			evt, err := suite.lastEvent(ctx)
			suite.NoError(err)
			suite.NotNil(evt)
			suite.Equal(test.expected.UserID, evt.UserID)
			suite.Equal(test.expected.EventType, evt.EventType)
			suite.Equal(test.expected.Params, evt.Params)
		})
	}
}

func (suite *userSuite) lastEvent(ctx context.Context) (*Event, error) {
	var events []*Event
	if err := suite.db.SelectContext(ctx, &events, "SELECT * FROM events ORDER BY created_at DESC LIMIT 1"); err != nil {
		return nil, err
	}

	return events[0], nil
}
