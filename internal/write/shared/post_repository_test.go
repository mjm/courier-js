package shared

import (
	"fmt"
	"time"

	"github.com/mjm/courier-js/internal/shared/model"
)

func (suite *dynamoSuite) TestCreateSinglePost() {
	id := model.PostIDFromParts(model.NewFeedID(), "https://www.example.org/post/abc")
	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	err := suite.postRepo.Write(suite.Ctx(), []WritePostParams{
		{
			ID:          id,
			TextContent: "this is text",
			HTMLContent: "<p>this is html</p>",
			Title:       "A New Post",
			URL:         "https://www.example.org/post/abc/",
			PublishedAt: &t,
			ModifiedAt:  &t,
		},
	})
	suite.NoError(err)

	posts, err := suite.postRepo.FindByItemIDs(suite.Ctx(), id.FeedID, []string{id.ItemID})
	suite.NoError(err)
	suite.Equal(1, len(posts))

	post := posts[0]
	suite.Equal(id, post.ID)
	suite.Equal("this is text", post.TextContent)
	suite.Equal("<p>this is html</p>", post.HTMLContent)
	suite.Equal("A New Post", post.Title)
	suite.Equal("https://www.example.org/post/abc/", post.URL)
	suite.Equal(t, *post.PublishedAt)
	suite.Equal(t, *post.ModifiedAt)
}

func (suite *dynamoSuite) TestCreateManyPosts() {
	feedID := model.NewFeedID()
	var ps []WritePostParams
	for i := 0; i < 20; i++ {
		t := time.Date(2020, time.January, 2, 3, 4, i, 0, time.UTC)
		u := fmt.Sprintf("https://www.example.org/post/%d", i+1)
		ps = append(ps, WritePostParams{
			ID:          model.PostIDFromParts(feedID, u),
			TextContent: fmt.Sprintf("this is post #%d", i+1),
			HTMLContent: fmt.Sprintf("<p>this is post #%d</p>", i+1),
			Title:       fmt.Sprintf("Post #%d", i+1),
			URL:         u,
			PublishedAt: &t,
			ModifiedAt:  &t,
		})
	}

	suite.NoError(suite.postRepo.Write(suite.Ctx(), ps))

	// cherry pick a few to fetch
	posts, err := suite.postRepo.FindByItemIDs(suite.Ctx(), feedID, []string{
		"https://www.example.org/post/1",
		"https://www.example.org/post/7",
		"https://www.example.org/post/20",
	})
	suite.NoError(err)
	suite.Equal(3, len(posts))

	suite.Equal("this is post #1", posts[0].TextContent)
	suite.Equal("https://www.example.org/post/1", posts[0].URL)
	suite.Equal(time.Date(2020, time.January, 2, 3, 4, 0, 0, time.UTC), *posts[0].PublishedAt)
	suite.Equal("<p>this is post #7</p>", posts[1].HTMLContent)
	suite.Equal(time.Date(2020, time.January, 2, 3, 4, 6, 0, time.UTC), *posts[1].ModifiedAt)
	suite.Equal("Post #20", posts[2].Title)
}

func (suite *dynamoSuite) TestUpdateSinglePost() {
	id := model.PostIDFromParts(model.NewFeedID(), "https://www.example.org/post/abc")
	t := time.Date(2020, time.January, 2, 3, 4, 5, 0, time.UTC)

	err := suite.postRepo.Write(suite.Ctx(), []WritePostParams{
		{
			ID:          id,
			TextContent: "this is text",
			HTMLContent: "<p>this is html</p>",
			Title:       "A New Post",
			URL:         "https://www.example.org/post/abc/",
			PublishedAt: &t,
			ModifiedAt:  &t,
		},
	})
	suite.NoError(err)

	t2 := t.Add(time.Hour)
	err = suite.postRepo.Write(suite.Ctx(), []WritePostParams{
		{
			ID:          id,
			TextContent: "this is updated text",
			HTMLContent: "<p>this is updated html</p>",
			Title:       "An Updated Post",
			URL:         "https://www.example.org/post/abc",
			PublishedAt: &t,
			ModifiedAt:  &t2,
		},
	})
	suite.NoError(err)

	posts, err := suite.postRepo.FindByItemIDs(suite.Ctx(), id.FeedID, []string{id.ItemID})
	suite.NoError(err)
	suite.Equal(1, len(posts))

	post := posts[0]
	suite.Equal(id, post.ID)
	suite.Equal("this is updated text", post.TextContent)
	suite.Equal("<p>this is updated html</p>", post.HTMLContent)
	suite.Equal("An Updated Post", post.Title)
	suite.Equal("https://www.example.org/post/abc", post.URL)
	suite.Equal(t, *post.PublishedAt)
	suite.Equal(t2, *post.ModifiedAt)
}

func (suite *dynamoSuite) TestUpdateManyPosts() {
	feedID := model.NewFeedID()
	var ps []WritePostParams
	for i := 0; i < 20; i++ {
		t := time.Date(2020, time.January, 2, 3, 4, i, 0, time.UTC)
		u := fmt.Sprintf("https://www.example.org/post/%d", i+1)
		ps = append(ps, WritePostParams{
			ID:          model.PostIDFromParts(feedID, u),
			TextContent: fmt.Sprintf("this is post #%d", i+1),
			HTMLContent: fmt.Sprintf("<p>this is post #%d</p>", i+1),
			Title:       fmt.Sprintf("Post #%d", i+1),
			URL:         u,
			PublishedAt: &t,
			ModifiedAt:  &t,
		})
	}

	suite.NoError(suite.postRepo.Write(suite.Ctx(), ps))

	for i := range ps {
		ps[i].Title = fmt.Sprintf("Updated Post #%d", i+1)
		ps[i].TextContent = fmt.Sprintf("this is updated post #%d", i+1)
		ps[i].HTMLContent = fmt.Sprintf("<p>this is updated post #%d</p>", i+1)
		t := ps[i].ModifiedAt.Add(24 * time.Hour)
		ps[i].ModifiedAt = &t
	}

	suite.NoError(suite.postRepo.Write(suite.Ctx(), ps))

	// cherry pick a few to fetch
	posts, err := suite.postRepo.FindByItemIDs(suite.Ctx(), feedID, []string{
		"https://www.example.org/post/1",
		"https://www.example.org/post/7",
		"https://www.example.org/post/20",
	})
	suite.NoError(err)
	suite.Equal(3, len(posts))

	suite.Equal("this is updated post #1", posts[0].TextContent)
	suite.Equal(time.Date(2020, time.January, 2, 3, 4, 0, 0, time.UTC), *posts[0].PublishedAt)
	suite.Equal("<p>this is updated post #7</p>", posts[1].HTMLContent)
	suite.Equal(time.Date(2020, time.January, 3, 3, 4, 6, 0, time.UTC), *posts[1].ModifiedAt)
	suite.Equal("Updated Post #20", posts[2].Title)
}
