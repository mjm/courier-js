package feed

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
)

func ByURL(ctx context.Context, db *db.DB, url string) (*Feed, error) {
	var feed Feed
	if err := db.QueryRowxContext(ctx, `
		SELECT * FROM feeds WHERE url = $1
	`, url).StructScan(&feed); err != nil {
		return nil, err
	}

	return &feed, nil
}
