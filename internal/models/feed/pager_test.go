package feed

import (
	"context"
	"fmt"
	"testing"

	"github.com/khaiql/dbcleaner/engine"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/stretchr/testify/suite"
)

type pagerSuite struct {
	suite.Suite
	db db.DB
}

func (suite *pagerSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))
}

func (suite *pagerSuite) SetupTest() {
	cleaner.Acquire("feeds")
}

func (suite *pagerSuite) TearDownTest() {
	cleaner.Clean("feeds")
}

func (suite *pagerSuite) TestSubscriptionsEmpty() {
	ctx := context.Background()
	var first int32 = 10
	conn, err := pager.Paged(ctx, suite.db, &SubscriptionPager{UserID: "test_user"}, pager.Options{First: &first})
	suite.NoError(err)
	suite.Equal(0, len(conn.Edges))
	suite.Equal(int32(0), conn.TotalCount)
	suite.False(conn.PageInfo.HasNextPage)
	suite.False(conn.PageInfo.HasPreviousPage)
	suite.Nil(conn.PageInfo.StartCursor)
	suite.Nil(conn.PageInfo.EndCursor)
}

func (suite *pagerSuite) TestSubscriptionsLessThanFullPage() {
	ctx := context.Background()
	suite.NoError(suite.createSubscriptions(ctx, 3))

	var first int32 = 10
	conn, err := pager.Paged(ctx, suite.db, &SubscriptionPager{UserID: "test_user"}, pager.Options{First: &first})
	suite.NoError(err)

	suite.Equal(3, len(conn.Edges))
	suite.Equal(int32(3), conn.TotalCount)
	suite.False(conn.PageInfo.HasNextPage)
	suite.False(conn.PageInfo.HasPreviousPage)
	suite.Equal(pager.Cursor("https://www.example.com/feed0.json"), *conn.PageInfo.StartCursor)
	suite.Equal(pager.Cursor("https://www.example.com/feed2.json"), *conn.PageInfo.EndCursor)

	sub, ok := conn.Edges[0].Node.(*Subscription)
	suite.True(ok)
	suite.Equal("test_user", sub.UserID)
	suite.Equal(pager.Cursor("https://www.example.com/feed0.json"), conn.Edges[0].Cursor)
}

func (suite *pagerSuite) TestSubscriptionsExactlyFullPage() {
	ctx := context.Background()
	suite.NoError(suite.createSubscriptions(ctx, 5))

	var first int32 = 5
	conn, err := pager.Paged(ctx, suite.db, &SubscriptionPager{UserID: "test_user"}, pager.Options{First: &first})
	suite.NoError(err)

	suite.Equal(5, len(conn.Edges))
	suite.Equal(int32(5), conn.TotalCount)
	suite.False(conn.PageInfo.HasNextPage)
	suite.False(conn.PageInfo.HasPreviousPage)
	suite.Equal(pager.Cursor("https://www.example.com/feed0.json"), *conn.PageInfo.StartCursor)
	suite.Equal(pager.Cursor("https://www.example.com/feed4.json"), *conn.PageInfo.EndCursor)
}

func (suite *pagerSuite) TestSubscriptionsMoreThanPage() {
	ctx := context.Background()
	suite.NoError(suite.createSubscriptions(ctx, 6))

	var first int32 = 5
	conn, err := pager.Paged(ctx, suite.db, &SubscriptionPager{UserID: "test_user"}, pager.Options{First: &first})
	suite.NoError(err)

	suite.Equal(5, len(conn.Edges))
	suite.Equal(int32(6), conn.TotalCount)
	suite.True(conn.PageInfo.HasNextPage)
	suite.False(conn.PageInfo.HasPreviousPage)
	suite.Equal(pager.Cursor("https://www.example.com/feed0.json"), *conn.PageInfo.StartCursor)
	suite.Equal(pager.Cursor("https://www.example.com/feed4.json"), *conn.PageInfo.EndCursor)
}

func (suite *pagerSuite) TestSubscriptionsExcludeDiscarded() {
	ctx := context.Background()
	suite.NoError(suite.createSubscriptions(ctx, 4))

	var first int32 = 5
	conn, err := pager.Paged(ctx, suite.db, &SubscriptionPager{UserID: "test_user"}, pager.Options{First: &first})
	suite.NoError(err)

	sub := conn.Edges[0].Node.(*Subscription)
	suite.NoError(DeleteSubscription(ctx, suite.db, "test_user", sub.ID))

	conn, err = pager.Paged(ctx, suite.db, &SubscriptionPager{UserID: "test_user"}, pager.Options{First: &first})
	suite.NoError(err)

	suite.Equal(3, len(conn.Edges))
	suite.Equal(int32(3), conn.TotalCount)
	suite.False(conn.PageInfo.HasNextPage)
	suite.False(conn.PageInfo.HasPreviousPage)
	suite.Equal(pager.Cursor("https://www.example.com/feed1.json"), *conn.PageInfo.StartCursor)
	suite.Equal(pager.Cursor("https://www.example.com/feed3.json"), *conn.PageInfo.EndCursor)
}

func (suite *pagerSuite) TestSubscriptionsExcludeOtherUsers() {
	ctx := context.Background()
	suite.NoError(suite.createSubscriptions(ctx, 5))

	f, err := ByURL(ctx, suite.db, "https://www.example.com/feed0.json")
	suite.NoError(err)

	_, err = CreateSubscription(ctx, suite.db, "test_user2", f.ID)
	suite.NoError(err)

	var first int32 = 5
	conn, err := pager.Paged(ctx, suite.db, &SubscriptionPager{UserID: "test_user"}, pager.Options{First: &first})
	suite.NoError(err)

	suite.Equal(5, len(conn.Edges))
	suite.Equal(int32(5), conn.TotalCount)
	suite.False(conn.PageInfo.HasNextPage)
	suite.False(conn.PageInfo.HasPreviousPage)
	suite.Equal(pager.Cursor("https://www.example.com/feed0.json"), *conn.PageInfo.StartCursor)
	suite.Equal(pager.Cursor("https://www.example.com/feed4.json"), *conn.PageInfo.EndCursor)
}

func (suite *pagerSuite) createSubscriptions(ctx context.Context, n int) error {
	for i := 0; i < n; i++ {
		url := fmt.Sprintf("https://www.example.com/feed%d.json", i)
		f, err := Create(ctx, suite.db, url)
		if err != nil {
			return err
		}

		_, err = CreateSubscription(ctx, suite.db, "test_user", f.ID)
		if err != nil {
			return err
		}
	}
	return nil
}

func TestPagerSuite(t *testing.T) {
	suite.Run(t, new(pagerSuite))
}
