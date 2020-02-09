package feeds

import (
	"context"
	"database/sql"
	"errors"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/write/feeds/queries"
)

var (
	// ErrNoFeed is returned when a specific feed cannot be found.
	ErrNoFeed = errors.New("no feed found")
)

// FeedRepository fetches and stores information about feeds.
type FeedRepository struct {
	db db.DB
}

// NewFeedRepository creates a new feed repository targeting a given database.
func NewFeedRepository(db db.DB) *FeedRepository {
	return &FeedRepository{db: db}
}

// Get gets the feed with the given ID.
func (r *FeedRepository) Get(ctx context.Context, id FeedID) (*Feed, error) {
	var feed Feed
	if err := r.db.QueryRowxContext(ctx, queries.FeedsGet, id).StructScan(&feed); err != nil {
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
	if err := r.db.QueryRowxContext(ctx, queries.FeedsGetByURL, url).StructScan(&feed); err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrNoFeed
		}
		return nil, err
	}

	return &feed, nil
}

// Create adds a new feed with the given URL to the database.
func (r *FeedRepository) Create(ctx context.Context, id FeedID, url string) error {
	if _, err := r.db.ExecContext(ctx, queries.FeedsCreate, id, url); err != nil {
		return err
	}

	return nil
}

// UpdateFeedParams are values about a feed that can be updated when refreshing.
type UpdateFeedParams struct {
	ID             FeedID
	Title          string
	HomePageURL    string
	CachingHeaders *CachingHeaders
	MPEndpoint     string
}

// Update saves new metadata about a feed.
func (r *FeedRepository) Update(ctx context.Context, p UpdateFeedParams) error {
	if _, err := r.db.ExecContext(ctx, queries.FeedsUpdate,
		p.Title, p.HomePageURL, p.CachingHeaders, p.MPEndpoint, p.ID); err != nil {
		return err
	}

	return nil
}
