package tweets

import (
	"context"

	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/write/tweets/queries"
)

type PostRepository struct {
	db db.DB
}

func NewPostRepository(db db.DB) *PostRepository {
	return &PostRepository{db: db}
}

func (r *PostRepository) ByIDs(ctx context.Context, ids []PostID) ([]*Post, error) {
	var posts []*Post
	if err := r.db.SelectContext(ctx, &posts, queries.PostsByIDs, pq.Array(ids)); err != nil {
		return nil, err
	}
	return posts, nil
}

func (r *PostRepository) RecentPosts(ctx context.Context, feedID FeedID) ([]*Post, error) {
	var posts []*Post
	if err := r.db.SelectContext(ctx, &posts, queries.PostsRecent, feedID); err != nil {
		return nil, err
	}
	return posts, nil
}
