package notifications

import (
	"context"
	"strconv"

	pushnotifications "github.com/pusher/push-notifications-go"

	"github.com/mjm/courier-js/internal/event"
	readtweets "github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace"
)

type Notifier struct {
	beams  pushnotifications.PushNotifications
	tweets readtweets.TweetQueries
}

func NewNotifier(bus *event.Bus, beams pushnotifications.PushNotifications, tweetQueries readtweets.TweetQueries) *Notifier {
	n := &Notifier{
		beams:  beams,
		tweets: tweetQueries,
	}
	bus.Notify(n, tweets.TweetsImported{}, tweets.TweetPosted{})
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
	ctx = trace.Start(ctx, "Send tweets imported")
	defer trace.Finish(ctx)

	trace.UserID(ctx, evt.UserId)
	trace.AddField(ctx, "tweet.count", len(evt.CreatedTweetIds))

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
		trace.TweetID(ctx, tweetID)

		tweet, err := n.tweets.PrivilegedGet(ctx, tweetID)
		if err != nil {
			trace.Error(ctx, err)
			return
		}

		if evt.Autopost {
			alert["title-loc-key"] = "IMPORTED_TWEET_TITLE_AUTOPOST"
		} else {
			alert["title-loc-key"] = "IMPORTED_TWEET_TITLE_NO_AUTOPOST"
		}
		alert["body"] = tweet.Body

		aps["thread-id"] = tweet.ID.String()
		payload["tweetId"] = tweet.ID.String()
	} else {
		alert["title-loc-args"] = []string{strconv.Itoa(len(evt.CreatedTweetIds))}
		if evt.Autopost {
			alert["title-loc-key"] = "IMPORTED_TWEETS_AUTOPOST"
		} else {
			alert["title-loc-key"] = "IMPORTED_TWEETS_NO_AUTOPOST"
		}
		alert["body"] = ""
	}

	publishID, err := n.beams.PublishToUsers([]string{evt.UserId}, map[string]interface{}{
		"apns": payload,
	})
	if err != nil {
		trace.Error(ctx, err)
		return
	}

	trace.AddField(ctx, "notification.publish_id", publishID)
}

func (n *Notifier) handleTweetPosted(ctx context.Context, evt tweets.TweetPosted) {
	ctx = trace.Start(ctx, "Send tweet posted")
	defer trace.Finish(ctx)

	tweetID := tweets.TweetID(evt.TweetId)

	trace.UserID(ctx, evt.UserId)
	trace.TweetID(ctx, tweetID)

	tweet, err := n.tweets.PrivilegedGet(ctx, tweetID)
	if err != nil {
		trace.Error(ctx, err)
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
	alert["body"] = tweet.Body

	publishID, err := n.beams.PublishToUsers([]string{evt.UserId}, map[string]interface{}{
		"apns": payload,
	})
	if err != nil {
		trace.Error(ctx, err)
		return
	}

	trace.AddField(ctx, "notification.publish_id", publishID)
}
