package post

import (
	"context"
	"strconv"

	"github.com/graph-gophers/dataloader"
	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
)

type Loader struct {
	*dataloader.Loader
}

const postsQuery = `
	SELECT
		*
	FROM
		posts
	WHERE id = ANY($1)
`

func NewLoader(db db.DB) Loader {
	return Loader{
		loader.New("Post Loader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
			rows, err := db.QueryxContext(ctx, postsQuery, loader.IntArray(keys))
			if err != nil {
				panic(err)
			}
			return loader.Gather(keys, rows, func(rows *sqlx.Rows) (interface{}, string, error) {
				var post Post
				if err := rows.StructScan(&post); err != nil {
					return nil, "", err
				}

				return &post, strconv.Itoa(post.ID), nil
			})
		}),
	}
}

type ByItemIDLoader struct {
	*dataloader.Loader
}

const postsByItemIDQuery = `
	SELECT
		*
	FROM
		posts
	WHERE feed_id = $1
		AND item_id = ANY($2)
`

func NewByItemIDLoader(db db.DB, feedID int) ByItemIDLoader {
	return ByItemIDLoader{
		loader.New("Post by Item ID Loader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
			rows, _ := db.QueryxContext(ctx, postsByItemIDQuery, feedID, loader.StringArray(keys))
			return loader.Gather(keys, rows, func(rows *sqlx.Rows) (interface{}, string, error) {
				var post Post
				if err := rows.StructScan(&post); err != nil {
					return nil, "", err
				}

				return &post, post.ItemID, nil
			})
		}),
	}
}
