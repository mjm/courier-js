package notifications

// type notificationsSuite struct {
// 	suite.Suite
// 	cleaner  dbcleaner.DbCleaner
// 	db       db.DB
// 	eventBus *event.Bus
//
// 	tweets        tweets2.TweetQueries
// 	notifications *fakePushNotifications
// 	notifier      *Notifier
// }
//
// func (suite *notificationsSuite) SetupSuite() {
// 	os.Setenv("APP_ENV", "test")
//
// 	suite.db = db.NewTestingDB()
// 	suite.cleaner = dbcleaner.New()
// 	suite.cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))
//
// 	suite.eventBus = event.NewBus()
// 	suite.notifications = &fakePushNotifications{}
// 	suite.tweets = tweets2.NewTweetQueries(suite.db)
// 	suite.notifier = NewNotifier(suite.eventBus, suite.notifications, suite.tweets)
// }
//
// func (suite *notificationsSuite) SetupTest() {
// 	suite.cleaner.Acquire("feeds", "feed_subscriptions", "posts", "tweets")
// 	_, err := suite.db.ExecContext(context.Background(), queries.FixturesExample)
// 	suite.NoError(err)
//
// 	suite.notifications.notes = nil
// }
//
// func (suite *notificationsSuite) TearDownTest() {
// 	suite.cleaner.Clean("feeds", "feed_subscriptions", "posts", "tweets")
// }
//
// func TestNotificationsSuite(t *testing.T) {
// 	suite.Run(t, new(notificationsSuite))
// }
