package feed

import (
	"context"
	"database/sql"
	"testing"

	"github.com/khaiql/dbcleaner/engine"
	"github.com/mjm/courier-js/internal/db"
	"github.com/stretchr/testify/suite"
)

type querySuite struct {
	suite.Suite
	db db.DB
}

func (suite *querySuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))
}

func (suite *querySuite) SetupTest() {
	cleaner.Acquire("feeds")
}

func (suite *querySuite) TearDownTest() {
	cleaner.Clean("feeds")
}

func (suite *querySuite) TestByURLNoFeed() {
	ctx := context.Background()
	f, err := ByURL(ctx, suite.db, "https://www.example.org/feed.json")
	suite.Nil(f)
	suite.Equal(sql.ErrNoRows, err)
}

func (suite *querySuite) TestByURL() {
	ctx := context.Background()
	f1, err := Create(ctx, suite.db, "https://www.example.org/feed.json")
	suite.NoError(err)

	f2, err := ByURL(ctx, suite.db, "https://www.example.org/feed.json")
	suite.NoError(err)
	suite.Equal(f1.ID, f2.ID)

	_, err = ByURL(ctx, suite.db, "https://other.com/blah")
	suite.Equal(sql.ErrNoRows, err)
}

func TestQuerySuite(t *testing.T) {
	suite.Run(t, new(querySuite))
}
