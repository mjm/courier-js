package feeds

import (
	"context"
	"database/sql"
	"errors"

	"github.com/mjm/courier-js/internal/db"
)

var (
	// ErrNoFeed is returned when a specific feed cannot be found.
	ErrNoFeed = errors.New("no feed found")
)

// FeedRepository fetches and stores information about feeds.
type FeedRepository struct {
	db *db.DB
}

// NewFeedRepository creates a new feed repository targeting a given database.
func NewFeedRepository(db *db.DB) *FeedRepository {
	return &FeedRepository{db: db}
}

// Get gets the feed with the given ID.
func (r *FeedRepository) Get(ctx context.Context, id int) (*Feed, error) {
	var feed Feed
	if err := r.db.QueryRowxContext(ctx, `
		SELECT * FROM feeds WHERE id = $1
	`, id).StructScan(&feed); err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrNoFeed
		}
		return nil, err
	}

	return &feed, nil
}

// GetByURL gets the feed with the given URL, if it exists.
func (r *FeedRepository) GetByURL(ctx context.Context, url string) (*Feed, error) {
	var feed Feed
	if err := r.db.QueryRowxContext(ctx, `
		SELECT * FROM feeds WHERE url = $1
	`, url).StructScan(&feed); err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrNoFeed
		}
		return nil, err
	}

	return &feed, nil
}

// Create adds a new feed with the given URL to the database.
func (r *FeedRepository) Create(ctx context.Context, url string) (int, error) {
	var id int
	if err := r.db.QueryRowxContext(ctx, `
		INSERT INTO feeds (url) VALUES ($1) RETURNING id
	`, url).Scan(&id); err != nil {
		return 0, err
	}

	return id, nil
}

// UpdateFeedParams are values about a feed that can be updated when refreshing.
type UpdateFeedParams struct {
	ID             int
	Title          string
	HomePageURL    string
	CachingHeaders *CachingHeaders
	MPEndpoint     string
}

// Update saves new metadata about a feed.
func (r *FeedRepository) Update(ctx context.Context, p UpdateFeedParams) error {
	if _, err := r.db.ExecContext(ctx, `
		UPDATE
			feeds
		SET
			title = $1,
			home_page_url = $2,
			caching_headers = $3,
			mp_endpoint = $4,
			refreshed_at = CURRENT_TIMESTAMP,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $5
		RETURNING *
	`, p.Title, p.HomePageURL, p.CachingHeaders, p.MPEndpoint, p.ID); err != nil {
		return err
	}

	return nil
}
