package tweets

import (
	"context"
	"time"

	"github.com/mjm/courier-js/internal/shared/feeds"
)

func (suite *tweetsSuite) TestPostsByIDs() {
	ctx := context.Background()
	ids := []feeds.PostID{
		"f536e1b2-ddaa-49fa-97e7-6065714660a3",
		"4a5fc152-1b2a-40eb-969f-8b1473cd28f2",
	}
	posts, err := suite.postRepo.ByIDs(ctx, ids)
	suite.NoError(err)
	suite.Equal(2, len(posts))

	suite.Equal(feeds.PostID("4a5fc152-1b2a-40eb-969f-8b1473cd28f2"), posts[0].ID)
	suite.Equal("https://example.com/item-1", posts[0].ItemID)
	suite.Equal("", posts[0].TextContent)
	suite.Equal("<p>This is my first example post</p>", posts[0].HTMLContent)
	suite.Equal("", posts[0].Title)
	suite.Equal("https://example.com/item-1", posts[0].URL)
	t := time.Date(2020, time.January, 1, 12, 0, 0, 0, time.UTC)
	suite.Equal(t, posts[0].PublishedAt.Time.UTC())
	suite.Equal(t, posts[0].ModifiedAt.Time.UTC())

	suite.Equal(feeds.PostID("f536e1b2-ddaa-49fa-97e7-6065714660a3"), posts[1].ID)
	suite.Equal("https://example.com/item-2", posts[1].ItemID)
	suite.Equal("", posts[1].TextContent)
	suite.Equal("<p>This is a second example post</p>", posts[1].HTMLContent)
	suite.Equal("A Titled Post", posts[1].Title)
	suite.Equal("https://example.com/item-2", posts[1].URL)
	t = t.Add(time.Hour)
	suite.Equal(t, posts[1].PublishedAt.Time.UTC())
	suite.Equal(t, posts[1].ModifiedAt.Time.UTC())
}

func (suite *tweetsSuite) TestRecentPosts() {
	ctx := context.Background()
	posts, err := suite.postRepo.RecentPosts(ctx, "46c2aa85-5124-40c1-896d-1e2ca4eb8587")
	suite.NoError(err)
	suite.Equal(3, len(posts))

	suite.Equal(feeds.PostID("f536e1b2-ddaa-49fa-97e7-6065714660a3"), posts[0].ID)
	suite.Equal("https://example.com/item-2", posts[0].ItemID)

	suite.Equal(feeds.PostID("4a5fc152-1b2a-40eb-969f-8b1473cd28f2"), posts[1].ID)
	suite.Equal("https://example.com/item-1", posts[1].ItemID)
}
