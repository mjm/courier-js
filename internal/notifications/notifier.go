package notifications

import (
	"context"
	"fmt"
	"os"
	"strconv"

	pushnotifications "github.com/pusher/push-notifications-go"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/event"
	readtweets "github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/notifications")

var (
	publishIDKey = key.New("notification.publish_id").String
)

type Notifier struct {
	beams  pushnotifications.PushNotifications
	tweets readtweets.TweetQueries
}

func NewNotifier(events event.Source, beams pushnotifications.PushNotifications, tweetQueries readtweets.TweetQueries) *Notifier {
	n := &Notifier{
		beams:  beams,
		tweets: tweetQueries,
	}
	events.Notify(n)
	return n
}

func (n *Notifier) HandleEvent(ctx context.Context, evt interface{}) {
	switch evt := evt.(type) {
	case tweets.TweetsImported:
		n.handleTweetsImported(ctx, evt)
	case tweets.TweetPosted:
		n.handleTweetPosted(ctx, evt)
	}
}

func (n *Notifier) handleTweetsImported(ctx context.Context, evt tweets.TweetsImported) {
	ctx, span := tracer.Start(ctx, "Notifier.handleTweetsImported",
		trace.WithAttributes(
			keys.UserID(evt.UserId),
			key.Int("tweet.count", len(evt.CreatedTweetIds))))
	defer span.End()

	if len(evt.CreatedTweetIds) == 0 {
		return
	}

	payload := make(map[string]interface{})

	aps := make(map[string]interface{})
	payload["aps"] = aps

	aps["category"] = "IMPORTED_TWEET"
	alert := make(map[string]interface{})
	aps["alert"] = alert

	if len(evt.CreatedTweetIds) == 1 {
		tweetID := tweets.TweetID(evt.CreatedTweetIds[0])
		span.SetAttributes(keys.TweetID(tweetID))

		tweet, err := n.tweets.PrivilegedGet(ctx, tweetID)
		if err != nil {
			span.RecordError(ctx, err)
			return
		}

		if evt.Autopost {
			alert["title-loc-key"] = "IMPORTED_TWEET_TITLE_AUTOPOST"
		} else {
			alert["title-loc-key"] = "IMPORTED_TWEET_TITLE_NO_AUTOPOST"
		}
		if os.Getenv("APP_ENV") == "production" {
			alert["body"] = tweet.Body
		} else {
			alert["body"] = fmt.Sprintf("[%s] %s", os.Getenv("APP_ENV"), tweet.Body)
		}

		aps["thread-id"] = tweet.ID.String()
		payload["tweetId"] = tweet.ID.String()
	} else {
		alert["title-loc-args"] = []string{strconv.Itoa(len(evt.CreatedTweetIds))}
		if evt.Autopost {
			alert["title-loc-key"] = "IMPORTED_TWEETS_AUTOPOST"
		} else {
			alert["title-loc-key"] = "IMPORTED_TWEETS_NO_AUTOPOST"
		}
		if os.Getenv("APP_ENV") == "production" {
			alert["body"] = ""
		} else {
			alert["body"] = fmt.Sprintf("[%s]", os.Getenv("APP_ENV"))
		}
	}

	publishID, err := n.beams.PublishToUsers([]string{evt.UserId}, map[string]interface{}{
		"apns": payload,
	})
	if err != nil {
		span.RecordError(ctx, err)
		return
	}

	span.SetAttributes(publishIDKey(publishID))
}

func (n *Notifier) handleTweetPosted(ctx context.Context, evt tweets.TweetPosted) {
	tweetID := tweets.TweetID(evt.TweetId)

	ctx, span := tracer.Start(ctx, "Notifier.handleTweetPosted",
		trace.WithAttributes(
			keys.UserID(evt.UserId),
			keys.TweetID(tweetID)))
	defer span.End()

	tweet, err := n.tweets.PrivilegedGet(ctx, tweetID)
	if err != nil {
		span.RecordError(ctx, err)
		return
	}

	payload := make(map[string]interface{})
	payload["tweetId"] = tweetID.String()
	aps := make(map[string]interface{})
	payload["aps"] = aps

	aps["category"] = "POSTED_TWEET"
	aps["thread-id"] = tweet.ID.String()
	alert := make(map[string]interface{})
	aps["alert"] = alert

	alert["title-loc-key"] = "POSTED_TWEET_TITLE"
	if os.Getenv("APP_ENV") == "production" {
		alert["body"] = tweet.Body
	} else {
		alert["body"] = fmt.Sprintf("[%s] %s", os.Getenv("APP_ENV"), tweet.Body)
	}

	publishID, err := n.beams.PublishToUsers([]string{evt.UserId}, map[string]interface{}{
		"apns": payload,
	})
	if err != nil {
		span.RecordError(ctx, err)
		return
	}

	span.SetAttributes(publishIDKey(publishID))
}
