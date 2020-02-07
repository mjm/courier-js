package feeds

import (
	"context"
	"fmt"
	"time"

	"github.com/mjm/courier-js/internal/write/feeds"
)

func (suite *feedsSuite) TestGetPost() {
	ctx := context.Background()
	feedID, err := suite.feedRepo.Create(ctx, "https://example.com/feed.json")
	suite.NoError(err)

	var newPosts []feeds.CreatePostParams
	for i := 0; i < 5; i++ {
		url := fmt.Sprintf("https://example.com/item-%d", i)
		t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)
		newPost := feeds.CreatePostParams{
			ItemID:      url,
			URL:         url,
			Title:       "a post title",
			TextContent: "text content",
			HTMLContent: "<p>HTML content</p>",
			PublishedAt: &t,
		}
		newPosts = append(newPosts, newPost)
	}

	created, err := suite.postRepo.Create(ctx, feedID, newPosts)
	suite.NoError(err)

	p, err := suite.postQueries.Get(ctx, created[2].ID)
	suite.NoError(err)
	suite.Equal("https://example.com/item-2", p.ItemID)

	p, err = suite.postQueries.Get(ctx, created[0].ID)
	suite.NoError(err)
	suite.Equal("https://example.com/item-0", p.ItemID)

	p, err = suite.postQueries.Get(ctx, created[4].ID)
	suite.NoError(err)
	suite.Equal("https://example.com/item-4", p.ItemID)
}
