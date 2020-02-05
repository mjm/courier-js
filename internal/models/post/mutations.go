package post

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
)

// Create adds one or more posts to the database.
func Create(ctx context.Context, conn db.DB, newPosts []*Post) ([]*Post, error) {
	// avoid a query if there are no values
	if len(newPosts) == 0 {
		return nil, nil
	}

	u := db.NewUnnester("int4", "text", "text", "text", "text", "text", "timestamp", "timestamp")
	for _, p := range newPosts {
		u.AppendRow(p.FeedID, p.ItemID, p.URL, p.Title, p.TextContent, p.HTMLContent, p.PublishedAt, p.ModifiedAt)
	}

	rows, err := conn.QueryxContext(ctx, `
		INSERT INTO posts (
			feed_id,
			item_id,
			url,
			title,
			text_content,
			html_content,
			published_at,
			modified_at
		)
		SELECT *
		FROM `+u.Unnest()+`
		RETURNING *
	`, u.Values()...)
	if err != nil {
		return nil, err
	}

	var posts []*Post
	for rows.Next() {
		var post Post
		if err := rows.StructScan(&post); err != nil {
			return nil, err
		}
		posts = append(posts, &post)
	}
	return posts, nil
}
