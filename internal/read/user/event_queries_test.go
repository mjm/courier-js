package user

import (
	"fmt"
	"time"

	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/model"
)

func (suite *dynamoSuite) TestPagedEventsEmpty() {
	conn, err := suite.eventQueries.Paged(suite.Ctx(), "test_user", pager.First(10, nil))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Empty(conn.Edges)
}

func (suite *dynamoSuite) TestPagedEvents() {
	eventTypes := []model.EventType{
		model.FeedSubscribe,
		model.SubscriptionCreate,
		model.SubscriptionRenew,
		model.TweetCancel,
		model.TweetPost,
		model.TweetAutopost,
	}

	for _, eventType := range eventTypes {
		suite.Require().NoError(suite.eventRepo.Create(suite.Ctx(), &model.Event{
			ID:        model.NewEventIDWithTime(suite.clock.Now()),
			UserID:    "test_user",
			EventType: eventType,
		}))

		suite.clock.Advance(time.Minute)
	}

	conn, err := suite.eventQueries.Paged(suite.Ctx(), "test_user", pager.First(4, nil))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	for _, e := range conn.Edges {
		fmt.Println(e.(*EventEdge).Event)
	}

	suite.Equal(4, len(conn.Edges))
	suite.True(conn.PageInfo.HasNextPage)
	suite.Equal(model.TweetAutopost, conn.Edges[0].(*EventEdge).EventType)
	suite.Equal(model.SubscriptionRenew, conn.Edges[3].(*EventEdge).EventType)

	c := conn.Edges[3].Cursor()
	conn, err = suite.eventQueries.Paged(suite.Ctx(), "test_user", pager.First(4, &c))
	suite.Require().NoError(err)
	suite.Require().NotNil(conn)

	suite.Equal(2, len(conn.Edges))
	suite.False(conn.PageInfo.HasNextPage)
	suite.Equal(model.SubscriptionCreate, conn.Edges[0].(*EventEdge).EventType)
	suite.Equal(model.FeedSubscribe, conn.Edges[1].(*EventEdge).EventType)
}
