package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/write/tweets/queries"
)

type PostRepository struct {
	db db.DB
}

func NewPostRepository(db db.DB) *PostRepository {
	return &PostRepository{db: db}
}

type MicropubInfo struct {
	URL         string `db:"url"`
	HomePageURL string `db:"home_page_url"`
	MPEndpoint  string `db:"mp_endpoint"`
}

func (r *PostRepository) MicropubInfo(ctx context.Context, postID feeds.PostID) (*MicropubInfo, error) {
	var info MicropubInfo
	if err := r.db.QueryRowxContext(ctx, queries.PostsMicropubEndpoint, postID).StructScan(&info); err != nil {
		return nil, err
	}

	return &info, nil
}
