package user

import (
	"testing"

	"github.com/khaiql/dbcleaner"
	"github.com/khaiql/dbcleaner/engine"
	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
)

var cleaner = dbcleaner.New()

type userSuite struct {
	suite.Suite
	db             db.DB
	eventBus       *event.Bus
	eventCollector *event.Collector
}

func (suite *userSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))
}

func (suite *userSuite) SetupTest() {
	suite.eventBus = event.NewBus()
	suite.eventCollector = &event.Collector{}

	cleaner.Acquire("events")
}

func (suite *userSuite) TearDownTest() {
	cleaner.Clean("events")
}

func (suite *userSuite) collectEvents(types ...interface{}) {
	suite.eventBus.Notify(suite.eventCollector, types...)
}

func TestUserSuite(t *testing.T) {
	suite.Run(t, new(userSuite))
}
