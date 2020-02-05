package post

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/khaiql/dbcleaner"
	"github.com/khaiql/dbcleaner/engine"
	"github.com/lib/pq"
	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/models/feed"
)

var cleaner = dbcleaner.New()

type mutationsSuite struct {
	suite.Suite
	db db.DB
}

func (suite *mutationsSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))
}

func (suite *mutationsSuite) SetupTest() {
	cleaner.Acquire("posts", "feeds")
}

func (suite *mutationsSuite) TearDownTest() {
	cleaner.Clean("posts", "feeds")
}

func (suite *mutationsSuite) TestCreateNone() {
	ctx := context.Background()
	posts, err := Create(ctx, suite.db, nil)
	suite.NoError(err)
	suite.Nil(posts)
}

func (suite *mutationsSuite) TestCreateOne() {
	ctx := context.Background()
	f, err := feed.Create(ctx, suite.db, "https://example.com/feed.json")
	suite.NoError(err)
	suite.NotNil(f)

	newPost := &Post{
		FeedID:      f.ID,
		ItemID:      "abc",
		URL:         "https://example.com/abc",
		Title:       "a post title",
		TextContent: "text content",
		HTMLContent: "<p>HTML content</p>",
		PublishedAt: pq.NullTime{
			Valid: true,
			Time:  time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC),
		},
	}
	posts, err := Create(ctx, suite.db, []*Post{newPost})
	suite.NoError(err)
	suite.Equal(1, len(posts))

	suite.NotEmpty(posts[0].ID)
	suite.Equal(f.ID, posts[0].FeedID)
	suite.Equal("abc", posts[0].ItemID)
	suite.Equal("https://example.com/abc", posts[0].URL)
	suite.Equal("a post title", posts[0].Title)
	suite.Equal("text content", posts[0].TextContent)
	suite.Equal("<p>HTML content</p>", posts[0].HTMLContent)
	suite.True(posts[0].PublishedAt.Valid)
	suite.Equal(newPost.PublishedAt.Time, posts[0].PublishedAt.Time.UTC())
	suite.False(posts[0].ModifiedAt.Valid)
}

func (suite *mutationsSuite) TestCreateMany() {
	ctx := context.Background()
	f, err := feed.Create(ctx, suite.db, "https://example.com/feed.json")
	suite.NoError(err)
	suite.NotNil(f)

	var newPosts []*Post
	for i := 0; i < 10; i++ {
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

	posts, err := Create(ctx, suite.db, newPosts)
	suite.NoError(err)
	suite.Equal(10, len(posts))

	for i, p := range posts {
		suite.NotEmpty(p.ID)
		suite.Equal(fmt.Sprintf("https://example.com/item-%d", i), p.ItemID)
	}
}

func TestMutationsSuite(t *testing.T) {
	suite.Run(t, new(mutationsSuite))
}
