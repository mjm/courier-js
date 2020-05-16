package notifications

import (
	"context"
	"fmt"
	"os"
	"strconv"

	"github.com/mjm/graphql-go/relay"
	pushnotifications "github.com/pusher/push-notifications-go"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/resolvers"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/internal/write/shared"
)

var tr = global.TraceProvider().Tracer("courier.blog/internal/notifications")

var (
	publishIDKey = key.New("notification.publish_id").String
)

type Notifier struct {
	beams     pushnotifications.PushNotifications
	tweetRepo *shared.TweetRepository
}

func NewNotifier(events event.Source, beams pushnotifications.PushNotifications, tweetRepo *shared.TweetRepository) *Notifier {
	n := &Notifier{
		beams:     beams,
		tweetRepo: tweetRepo,
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
	ctx, span := tr.Start(ctx, "Notifier.handleTweetsImported",
		trace.WithAttributes(
			keys.UserID(evt.UserId),
			key.Int("tweet.count", len(evt.CreatedItemIds))))
	defer span.End()

	if len(evt.CreatedItemIds) == 0 {
		return
	}

	payload := make(map[string]interface{})

	aps := make(map[string]interface{})
	payload["aps"] = aps

	aps["category"] = "IMPORTED_TWEET"
	alert := make(map[string]interface{})
	aps["alert"] = alert

	if len(evt.CreatedItemIds) == 1 {
		tweetID := model.TweetGroupIDFromParts(evt.UserId, model.FeedID(evt.FeedId), evt.CreatedItemIds[0])
		span.SetAttributes(keys.TweetGroupID(tweetID)...)

		tg, err := n.tweetRepo.Get(ctx, tweetID)
		if err != nil {
			span.RecordError(ctx, err)
			return
		}

		if evt.Autopost {
			alert["title-loc-key"] = "IMPORTED_TWEET_TITLE_AUTOPOST"
		} else {
			alert["title-loc-key"] = "IMPORTED_TWEET_TITLE_NO_AUTOPOST"
		}

		var bodyText string
		switch tg.Action {
		case model.ActionTweet:
			// TODO decide how to handle multiples
			bodyText = tg.Tweets[0].Body
		case model.ActionRetweet:
			bodyText = "Retweet"
		}

		if os.Getenv("APP_ENV") == "production" {
			alert["body"] = bodyText
		} else {
			alert["body"] = fmt.Sprintf("[%s] %s", os.Getenv("APP_ENV"), bodyText)
		}

		responseID := relay.MarshalID(resolvers.TweetNode, tg.PostID())

		aps["thread-id"] = responseID
		payload["data"] = map[string]interface{}{
			"tweetId": responseID,
		}
	} else {
		alert["title-loc-args"] = []string{strconv.Itoa(len(evt.CreatedItemIds))}
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
	id := model.TweetGroupIDFromParts(evt.UserId, model.FeedID(evt.FeedId), evt.ItemId)

	ctx, span := tr.Start(ctx, "Notifier.handleTweetPosted",
		trace.WithAttributes(keys.TweetGroupID(id)...))
	defer span.End()

	tg, err := n.tweetRepo.Get(ctx, id)
	if err != nil {
		span.RecordError(ctx, err)
		return
	}

	payload := make(map[string]interface{})
	aps := make(map[string]interface{})
	payload["aps"] = aps

	aps["category"] = "POSTED_TWEET"
	alert := make(map[string]interface{})
	aps["alert"] = alert

	alert["title-loc-key"] = "POSTED_TWEET_TITLE"

	var bodyText string
	switch tg.Action {
	case model.ActionTweet:
		// TODO decide how to handle multiples
		bodyText = tg.Tweets[0].Body
	case model.ActionRetweet:
		bodyText = "Retweet"
	}

	if os.Getenv("APP_ENV") == "production" {
		alert["body"] = bodyText
	} else {
		alert["body"] = fmt.Sprintf("[%s] %s", os.Getenv("APP_ENV"), bodyText)
	}

	responseID := relay.MarshalID(resolvers.TweetNode, tg.PostID())

	aps["thread-id"] = responseID
	payload["data"] = map[string]interface{}{
		"tweetId": responseID,
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
