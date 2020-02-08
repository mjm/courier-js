package tweets

import (
	"context"

	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/db"
)

type Post struct {
	ID          int         `db:"id"`
	ItemID      string      `db:"item_id"`
	TextContent string      `db:"text_content"`
	HTMLContent string      `db:"html_content"`
	Title       string      `db:"title"`
	URL         string      `db:"url"`
	PublishedAt pq.NullTime `db:"published_at"`
	ModifiedAt  pq.NullTime `db:"modified_at"`
}

type PostRepository struct {
	db db.DB
}

func NewPostRepository(db db.DB) *PostRepository {
	return &PostRepository{db: db}
}

func (r *PostRepository) ByIDs(ctx context.Context, ids []int) ([]*Post, error) {
	rows, err := r.db.QueryxContext(ctx, `
		SELECT
			id,
			item_id,
			text_content,
			html_content,
			title,
			url,
			published_at,
			modified_at
		FROM
			posts
		WHERE id = ANY($1)
	`, pq.Array(ids))
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