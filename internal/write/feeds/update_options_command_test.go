package feeds

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/feeds"
)

func (suite *feedsSuite) TestUpdateOptionsCommand() {
	suite.collectEvents(feeds.FeedOptionsChanged{})
	ctx := context.Background()

	cmd := UpdateOptionsCommand{
		UserID:         "test_user",
		SubscriptionID: "e9749df4-56d3-4716-a78f-2c00c38b9bdb",
		Autopost:       true,
	}
	_, err := suite.commandBus.Run(ctx, cmd)
	suite.NoError(err)

	suite.Equal([]interface{}{
		feeds.FeedOptionsChanged{
			UserId:             "test_user",
			FeedSubscriptionId: "e9749df4-56d3-4716-a78f-2c00c38b9bdb",
			Autopost:           true,
		},
	}, suite.eventCollector.Events)
}

func (suite *feedsSuite) TestUpdateOptionsCommandFails() {
	suite.collectEvents(feeds.FeedOptionsChanged{})
	ctx := context.Background()

	cmd := UpdateOptionsCommand{
		UserID:         "test_user2",
		SubscriptionID: "e9749df4-56d3-4716-a78f-2c00c38b9bdb",
		Autopost:       true,
	}
	_, err := suite.commandBus.Run(ctx, cmd)
	suite.EqualError(err, "no feed subscription found")

	suite.Empty(suite.eventCollector.Events)
}
