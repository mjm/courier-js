package feed

import (
	"context"
	"testing"

	"github.com/khaiql/dbcleaner/engine"
	"github.com/stretchr/testify/suite"
	"gopkg.in/khaiql/dbcleaner.v2"

	"github.com/mjm/courier-js/internal/db"
)

var cleaner = dbcleaner.New()

type mutationsSuite struct {
	suite.Suite
	db *db.DB
}

func (suite *mutationsSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))
}

func (suite *mutationsSuite) SetupTest() {
	cleaner.Acquire("feeds")
}

func (suite *mutationsSuite) TearDownTest() {
	cleaner.Clean("feeds")
}

func (suite *mutationsSuite) TestCreateFeed() {
	ctx := context.Background()
	f, err := Create(ctx, suite.db, "http://www.example.org/feed.json")
	suite.NoError(err)
	suite.NotEmpty(f.ID)
	suite.Equal("http://www.example.org/feed.json", f.URL)
	suite.NotEmpty(f.CreatedAt)
	suite.NotEmpty(f.UpdatedAt)
}

func (suite *mutationsSuite) TestCreateFeedAlreadyExists() {
	ctx := context.Background()
	_, err := Create(ctx, suite.db, "http://www.example.org/feed.json")
	suite.NoError(err)

	_, err = Create(ctx, suite.db, "http://www.example.org/feed.json")
	suite.Error(err)
}

func (suite *mutationsSuite) TestCreateSubscription() {
	ctx := context.Background()
	f, err := Create(ctx, suite.db, "http://www.example.org/feed.json")
	suite.NoError(err)

	sub, err := CreateSubscription(ctx, suite.db, "test_user", f.ID)
	suite.NoError(err)
	suite.NotEmpty(sub.ID)
	suite.Equal(f.ID, sub.FeedID)
	suite.Equal("test_user", sub.UserID)
	suite.NotEmpty(sub.CreatedAt)
	suite.NotEmpty(sub.UpdatedAt)
}

func (suite *mutationsSuite) TestCreateSubscriptionAlreadySubscribed() {
	ctx := context.Background()
	f, err := Create(ctx, suite.db, "http://www.example.org/feed.json")
	suite.NoError(err)

	sub1, err := CreateSubscription(ctx, suite.db, "test_user", f.ID)
	suite.NoError(err)

	sub2, err := CreateSubscription(ctx, suite.db, "test_user", f.ID)
	suite.NoError(err)
	suite.Equal(sub1.ID, sub2.ID)
	suite.Equal(f.ID, sub2.FeedID)
	suite.Equal("test_user", sub2.UserID)
	suite.NotEmpty(sub2.CreatedAt)
	suite.NotEmpty(sub2.UpdatedAt)
}

func (suite *mutationsSuite) TestCreateSubscriptionAnotherUserSubscribed() {
	ctx := context.Background()
	f, err := Create(ctx, suite.db, "http://www.example.org/feed.json")
	suite.NoError(err)

	sub1, err := CreateSubscription(ctx, suite.db, "test_user", f.ID)
	suite.NoError(err)

	sub2, err := CreateSubscription(ctx, suite.db, "test_user2", f.ID)
	suite.NoError(err)
	suite.NotEqual(sub1.ID, sub2.ID)
}

// TODO test reactivates old subscription

func TestMutationsSuite(t *testing.T) {
	suite.Run(t, new(mutationsSuite))
}
