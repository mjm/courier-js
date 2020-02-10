package tweets

import (
	"context"

	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/write/tweets/queries"
)

type Post struct {
	ID          PostID      `db:"guid"`
	ItemID      string      `db:"item_id"`
	TextContent string      `db:"text_content"`
	HTMLContent string      `db:"html_content"`
	Title       string      `db:"title"`
	URL         string      `db:"url"`
	PublishedAt pq.NullTime `db:"published_at"`
	ModifiedAt  pq.NullTime `db:"modified_at"`
}

type PostID string

type PostRepository struct {
	db db.DB
}

func NewPostRepository(db db.DB) *PostRepository {
	return &PostRepository{db: db}
}

func (r *PostRepository) ByIDs(ctx context.Context, ids []PostID) ([]*Post, error) {
	rows, err := r.db.QueryxContext(ctx, queries.PostsByIDs, pq.Array(ids))
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

func (r *PostRepository) RecentPosts(ctx context.Context, feedID FeedID) ([]*Post, error) {
	rows, err := r.db.QueryxContext(ctx, queries.PostsRecent, feedID)
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
