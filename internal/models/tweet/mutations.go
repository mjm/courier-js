package tweet

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
)

// Cancel marks a tweet as canceled as long as it is not already posted. It also clears
// the post_after field to prevent the tweet from being autoposted if it is uncanceled
// later.
func Cancel(ctx context.Context, db db.DB, id int) (*Tweet, error) {
	var tweet Tweet
	err := db.QueryRowxContext(ctx, `
		UPDATE tweets SET
			status = 'canceled',
			post_after = NULL,
			updated_at = CURRENT_TIMESTAMP
		WHERE
			id = $1
		AND
			status <> 'posted'
		RETURNING *
	`, id).StructScan(&tweet)

	if err != nil {
		return nil, err
	}

	return &tweet, nil
}
