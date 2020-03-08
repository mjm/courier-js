package notifications

import (
	"context"

	"github.com/google/uuid"
	pushnotifications "github.com/pusher/push-notifications-go"

	"github.com/mjm/courier-js/internal/shared/tweets"
)

type notification struct {
	users     []string
	interests []string
	payload   map[string]interface{}
}

type fakePushNotifications struct {
	notes []*notification
}

var _ pushnotifications.PushNotifications = (*fakePushNotifications)(nil)

func (n *fakePushNotifications) PublishToInterests(interests []string, request map[string]interface{}) (string, error) {
	n.notes = append(n.notes, &notification{
		interests: interests,
		payload:   request,
	})
	return uuid.New().String(), nil
}

func (n *fakePushNotifications) Publish(interests []string, request map[string]interface{}) (string, error) {
	return n.PublishToInterests(interests, request)
}

func (n *fakePushNotifications) PublishToUsers(users []string, request map[string]interface{}) (string, error) {
	n.notes = append(n.notes, &notification{
		users:   users,
		payload: request,
	})
	return uuid.New().String(), nil
}

func (n *fakePushNotifications) GenerateToken(userId string) (map[string]interface{}, error) {
	return nil, nil
}

func (n *fakePushNotifications) DeleteUser(userId string) error {
	return nil
}

func (suite *notificationsSuite) TestImportSingleTweet() {
	ctx := context.Background()

	suite.eventBus.Fire(ctx, tweets.TweetsImported{
		UserId:          "test_user",
		SubscriptionId:  "e9749df4-56d3-4716-a78f-2c00c38b9bdb",
		CreatedTweetIds: []string{"df850b2a-a4c1-4e51-95ea-5e0ad456310f"},
	})

	suite.Equal(1, len(suite.notifications.notes))
	note := suite.notifications.notes[0]
	suite.Equal([]string{"test_user"}, note.users)

	payload := note.payload["apns"].(map[string]interface{})
	aps := payload["aps"].(map[string]interface{})
	alert := aps["alert"].(map[string]interface{})

	suite.Equal("df850b2a-a4c1-4e51-95ea-5e0ad456310f", payload["tweetId"])
	suite.Equal("df850b2a-a4c1-4e51-95ea-5e0ad456310f", aps["thread-id"])
	suite.Equal("IMPORTED_TWEET", aps["category"])
	suite.Equal("IMPORTED_TWEET_TITLE_NO_AUTOPOST", alert["title-loc-key"])
	suite.Equal("This is my first example post", alert["body"])
}

func (suite *notificationsSuite) TestImportSingleTweetAutopost() {
	ctx := context.Background()

	suite.eventBus.Fire(ctx, tweets.TweetsImported{
		UserId:          "test_user",
		SubscriptionId:  "e9749df4-56d3-4716-a78f-2c00c38b9bdb",
		CreatedTweetIds: []string{"df850b2a-a4c1-4e51-95ea-5e0ad456310f"},
		Autopost:        true,
	})

	suite.Equal(1, len(suite.notifications.notes))
	note := suite.notifications.notes[0]
	suite.Equal([]string{"test_user"}, note.users)

	payload := note.payload["apns"].(map[string]interface{})
	aps := payload["aps"].(map[string]interface{})
	alert := aps["alert"].(map[string]interface{})

	suite.Equal("df850b2a-a4c1-4e51-95ea-5e0ad456310f", payload["tweetId"])
	suite.Equal("df850b2a-a4c1-4e51-95ea-5e0ad456310f", aps["thread-id"])
	suite.Equal("IMPORTED_TWEET", aps["category"])
	suite.Equal("IMPORTED_TWEET_TITLE_AUTOPOST", alert["title-loc-key"])
	suite.Equal("This is my first example post", alert["body"])
}

func (suite *notificationsSuite) TestImportMultipleTweets() {
	ctx := context.Background()

	suite.eventBus.Fire(ctx, tweets.TweetsImported{
		UserId:         "test_user3",
		SubscriptionId: "4b033437-c2a8-4775-b303-2764f2d73c31",
		CreatedTweetIds: []string{
			"398042cc-d2f6-4d91-bd81-a5a4f19f7746",
			"be94e030-6062-439f-8c73-3b24c08e6b5f",
			"5fea0b11-0264-4ebe-8cd6-1854ddf151ad",
		},
	})

	suite.Equal(1, len(suite.notifications.notes))
	note := suite.notifications.notes[0]
	suite.Equal([]string{"test_user3"}, note.users)

	payload := note.payload["apns"].(map[string]interface{})
	aps := payload["aps"].(map[string]interface{})
	alert := aps["alert"].(map[string]interface{})

	suite.Empty(payload["tweetId"])
	suite.Empty(aps["thread-id"])
	suite.Equal("IMPORTED_TWEET", aps["category"])
	suite.Equal("IMPORTED_TWEETS_NO_AUTOPOST", alert["title-loc-key"])
	suite.Equal("", alert["body"])
}

func (suite *notificationsSuite) TestImportMultipleTweetsAutopost() {
	ctx := context.Background()

	suite.eventBus.Fire(ctx, tweets.TweetsImported{
		UserId:         "test_user3",
		SubscriptionId: "4b033437-c2a8-4775-b303-2764f2d73c31",
		CreatedTweetIds: []string{
			"398042cc-d2f6-4d91-bd81-a5a4f19f7746",
			"be94e030-6062-439f-8c73-3b24c08e6b5f",
			"5fea0b11-0264-4ebe-8cd6-1854ddf151ad",
		},
		Autopost: true,
	})

	suite.Equal(1, len(suite.notifications.notes))
	note := suite.notifications.notes[0]
	suite.Equal([]string{"test_user3"}, note.users)

	payload := note.payload["apns"].(map[string]interface{})
	aps := payload["aps"].(map[string]interface{})
	alert := aps["alert"].(map[string]interface{})

	suite.Empty(payload["tweetId"])
	suite.Empty(aps["thread-id"])
	suite.Equal("IMPORTED_TWEET", aps["category"])
	suite.Equal("IMPORTED_TWEETS_AUTOPOST", alert["title-loc-key"])
	suite.Equal("", alert["body"])
}
