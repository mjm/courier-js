package user

import (
	"testing"

	"github.com/khaiql/dbcleaner"
	"github.com/khaiql/dbcleaner/engine"
	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/write"
)

var cleaner = dbcleaner.New()

type userSuite struct {
	suite.Suite
	db             db.DB
	commandBus     *write.CommandBus
	eventBus       *event.Bus
	eventCollector *event.Collector
}

func (suite *userSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))
}

func (suite *userSuite) SetupTest() {
	suite.commandBus = write.NewCommandBus()
	suite.eventBus = event.NewBus()
	suite.eventCollector = &event.Collector{}
	suite.eventBus.Notify(suite.eventCollector)

	cleaner.Acquire("events")
}

func (suite *userSuite) TearDownTest() {
	cleaner.Clean("events")
}

func TestUserSuite(t *testing.T) {
	suite.Run(t, new(userSuite))
}
