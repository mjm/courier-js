package post

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/graph-gophers/dataloader"
	"github.com/khaiql/dbcleaner/engine"
	"github.com/lib/pq"
	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/models/feed"
)

type loaderSuite struct {
	suite.Suite
	db *db.DB
}

func (suite *loaderSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))
}

func (suite *loaderSuite) SetupTest() {
	cleaner.Acquire("posts", "feeds")
}

func (suite *loaderSuite) TearDownTest() {
	cleaner.Clean("posts", "feeds")
}

func (suite *loaderSuite) TestLoadByID() {
	ctx := context.Background()
	f, err := feed.Create(ctx, suite.db, "https://example.com/feed.json")
	suite.NoError(err)
	suite.NotNil(f)

	var newPosts []*Post
	for i := 0; i < 5; i++ {
		url := fmt.Sprintf("https://example.com/item-%d", i)
		newPost := &Post{
			FeedID:      f.ID,
			ItemID:      url,
			URL:         url,
			Title:       "a post title",
			TextContent: "text content",
			HTMLContent: "<p>HTML content</p>",
			PublishedAt: pq.NullTime{
				Valid: true,
				Time:  time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC),
			},
		}
		newPosts = append(newPosts, newPost)
	}

	created, err := Create(ctx, suite.db, newPosts)
	suite.NoError(err)

	l := NewLoader(suite.db)
	posts, errs := l.LoadMany(ctx, []dataloader.Key{
		loader.IntKey(created[2].ID),
		loader.IntKey(created[0].ID),
		loader.IntKey(created[4].ID),
	})()

	for _, err := range errs {
		suite.NoError(err)
	}

	suite.Equal("https://example.com/item-2", posts[0].(*Post).ItemID)
	suite.Equal("https://example.com/item-0", posts[1].(*Post).ItemID)
	suite.Equal("https://example.com/item-4", posts[2].(*Post).ItemID)
}

func (suite *loaderSuite) TestLoadByItemID() {
	ctx := context.Background()
	f, err := feed.Create(ctx, suite.db, "https://example.com/feed.json")
	suite.NoError(err)
	suite.NotNil(f)

	var newPosts []*Post
	for i := 0; i < 5; i++ {
		url := fmt.Sprintf("https://example.com/item-%d", i)
		newPost := &Post{
			FeedID:      f.ID,
			ItemID:      url,
			URL:         url,
			Title:       "a post title",
			TextContent: "text content",
			HTMLContent: "<p>HTML content</p>",
			PublishedAt: pq.NullTime{
				Valid: true,
				Time:  time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC),
			},
		}
		newPosts = append(newPosts, newPost)
	}

	created, err := Create(ctx, suite.db, newPosts)
	suite.NoError(err)

	l := NewByItemIDLoader(suite.db, f.ID)
	posts, errs := l.LoadMany(ctx, dataloader.NewKeysFromStrings([]string{
		"https://example.com/item-2",
		"https://example.com/item-0",
		"https://example.com/item-4",
	}))()

	for _, err := range errs {
		suite.NoError(err)
	}

	suite.Equal(created[2].ID, posts[0].(*Post).ID)
	suite.Equal(created[0].ID, posts[1].(*Post).ID)
	suite.Equal(created[4].ID, posts[2].(*Post).ID)
}

func (suite *loaderSuite) TestLoadByItemIDWrongFeed() {
	ctx := context.Background()
	f, err := feed.Create(ctx, suite.db, "https://example.com/feed.json")
	suite.NoError(err)
	suite.NotNil(f)

	var newPosts []*Post
	for i := 0; i < 5; i++ {
		url := fmt.Sprintf("https://example.com/item-%d", i)
		newPost := &Post{
			FeedID:      f.ID,
			ItemID:      url,
			URL:         url,
			Title:       "a post title",
			TextContent: "text content",
			HTMLContent: "<p>HTML content</p>",
			PublishedAt: pq.NullTime{
				Valid: true,
				Time:  time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC),
			},
		}
		newPosts = append(newPosts, newPost)
	}

	_, err = Create(ctx, suite.db, newPosts)
	suite.NoError(err)

	l := NewByItemIDLoader(suite.db, f.ID+1000)
	posts, errs := l.LoadMany(ctx, dataloader.NewKeysFromStrings([]string{
		"https://example.com/item-2",
		"https://example.com/item-0",
		"https://example.com/item-4",
	}))()

	for _, err := range errs {
		suite.Error(err)
	}

	for _, p := range posts {
		suite.Nil(p)
	}
}

func TestLoaderSuite(t *testing.T) {
	suite.Run(t, new(loaderSuite))
}
