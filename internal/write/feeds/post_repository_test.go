package feeds

import (
	"context"
	"fmt"
	"time"
)

func (suite *feedsSuite) TestCreateNone() {
	ctx := context.Background()
	posts, err := suite.postRepo.Create(ctx, NewFeedID(), nil)
	suite.NoError(err)
	suite.Nil(posts)
}

func (suite *feedsSuite) TestCreateOne() {
	ctx := context.Background()
	feedID := NewFeedID()
	err := suite.feedRepo.Create(ctx, feedID, "https://example.com/feed.json")
	suite.NoError(err)

	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)
	newPost := CreatePostParams{
		ItemID:      "abc",
		URL:         "https://example.com/abc",
		Title:       "a post title",
		TextContent: "text content",
		HTMLContent: "<p>HTML content</p>",
		PublishedAt: &t,
	}
	posts, err := suite.postRepo.Create(ctx, feedID, []CreatePostParams{newPost})
	suite.NoError(err)
	suite.Equal(1, len(posts))

	suite.NotEmpty(posts[0].ID)
	suite.Equal(feedID, posts[0].FeedID)
	suite.Equal("abc", posts[0].ItemID)
	suite.Equal("https://example.com/abc", posts[0].URL)
	suite.Equal("a post title", posts[0].Title)
	suite.Equal("text content", posts[0].TextContent)
	suite.Equal("<p>HTML content</p>", posts[0].HTMLContent)
	suite.True(posts[0].PublishedAt.Valid)
	suite.Equal(t, posts[0].PublishedAt.Time.UTC())
	suite.False(posts[0].ModifiedAt.Valid)
}

func (suite *feedsSuite) TestCreateMany() {
	ctx := context.Background()
	feedID := NewFeedID()
	err := suite.feedRepo.Create(ctx, feedID, "https://example.com/feed.json")
	suite.NoError(err)

	var newPosts []CreatePostParams
	for i := 0; i < 10; i++ {
		url := fmt.Sprintf("https://example.com/item-%d", i)
		t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)
		newPost := CreatePostParams{
			ItemID:      url,
			URL:         url,
			Title:       "a post title",
			TextContent: "text content",
			HTMLContent: "<p>HTML content</p>",
			PublishedAt: &t,
		}
		newPosts = append(newPosts, newPost)
	}

	posts, err := suite.postRepo.Create(ctx, feedID, newPosts)
	suite.NoError(err)
	suite.Equal(10, len(posts))

	for i, p := range posts {
		suite.NotEmpty(p.ID)
		suite.Equal(fmt.Sprintf("https://example.com/item-%d", i), p.ItemID)
	}
}

func (suite *feedsSuite) TestLoadByItemID() {
	ctx := context.Background()
	feedID := NewFeedID()
	err := suite.feedRepo.Create(ctx, feedID, "https://example.com/feed.json")
	suite.NoError(err)

	var newPosts []CreatePostParams
	for i := 0; i < 5; i++ {
		url := fmt.Sprintf("https://example.com/item-%d", i)
		t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)
		newPost := CreatePostParams{
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

	posts, err := suite.postRepo.FindByItemIDs(ctx, feedID, []string{
		"https://example.com/item-2",
		"https://example.com/item-0",
		"https://example.com/item-4",
	})
	suite.NoError(err)

	suite.Equal(created[2].ID, posts[0].ID)
	suite.Equal(created[0].ID, posts[1].ID)
	suite.Equal(created[4].ID, posts[2].ID)
}

func (suite *feedsSuite) TestLoadByItemIDWrongFeed() {
	ctx := context.Background()
	feedID := NewFeedID()
	err := suite.feedRepo.Create(ctx, feedID, "https://example.com/feed.json")
	suite.NoError(err)

	var newPosts []CreatePostParams
	for i := 0; i < 5; i++ {
		url := fmt.Sprintf("https://example.com/item-%d", i)
		t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)
		newPost := CreatePostParams{
			ItemID:      url,
			URL:         url,
			Title:       "a post title",
			TextContent: "text content",
			HTMLContent: "<p>HTML content</p>",
			PublishedAt: &t,
		}
		newPosts = append(newPosts, newPost)
	}

	_, err = suite.postRepo.Create(ctx, feedID, newPosts)
	suite.NoError(err)

	posts, err := suite.postRepo.FindByItemIDs(ctx, NewFeedID(), []string{
		"https://example.com/item-2",
		"https://example.com/item-0",
		"https://example.com/item-4",
	})
	suite.NoError(err)

	for _, p := range posts {
		suite.Nil(p)
	}
}
