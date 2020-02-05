package event

import (
	"context"
	"testing"

	"github.com/khaiql/dbcleaner/engine"
	"github.com/stretchr/testify/suite"
	"gopkg.in/khaiql/dbcleaner.v2"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
)

var cleaner = dbcleaner.New()

type recordSuite struct {
	suite.Suite
	db db.DB
}

func (suite *recordSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))
}

func (suite *recordSuite) SetupTest() {
	cleaner.Acquire("events")
}

func (suite *recordSuite) TearDownTest() {
	cleaner.Clean("events")
}

func (suite *recordSuite) TestRecordEventAsUser() {
	ctx := context.Background()
	err := RecordAs(ctx, suite.db, "test_user", TweetCancel, Params{TweetID: "123"})
	suite.NoError(err)

	e := suite.getLastEvent(ctx, "test_user")
	suite.Equal("test_user", e.UserID)
	suite.Equal(TweetCancel, e.EventType)
	suite.Equal("123", e.Params.TweetID)
}

func (suite *recordSuite) TestRecordEventAsCurrentUser() {
	ctx := auth.WithMockUser(context.Background(), "test_user")
	err := Record(ctx, suite.db, TweetCancel, Params{TweetID: "123"})
	suite.NoError(err)

	e := suite.getLastEvent(ctx, "test_user")
	suite.Equal("test_user", e.UserID)
	suite.Equal(TweetCancel, e.EventType)
	suite.Equal("123", e.Params.TweetID)
}

func (suite *recordSuite) getLastEvent(ctx context.Context, userID string) *Event {
	var first int32 = 1
	conn, err := pager.Paged(ctx, suite.db, &Pager{UserID: userID}, pager.Options{
		First: &first,
	})
	suite.NoError(err)
	suite.Equal(1, len(conn.Edges))
	return conn.Edges[0].Node.(*Event)
}

func TestRecordSuite(t *testing.T) {
	suite.Run(t, new(recordSuite))
}
