package db

import (
	"context"

	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/trace"

	// ensure the postgres driver is present
	_ "github.com/lib/pq"
)

type Config struct {
	URL string
}

type DB struct {
	*sqlx.DB
}

func New(cfg Config) (*DB, error) {
	db, err := sqlx.Open("postgres", cfg.URL)
	if err != nil {
		return nil, err
	}

	return &DB{DB: db}, nil
}

func (db *DB) QueryxContext(ctx context.Context, query string, args ...interface{}) (*sqlx.Rows, error) {
	ctx = trace.Start(ctx, "SQL query")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"sql.query": query,
	})

	rows, err := db.DB.QueryxContext(ctx, query, args...)
	if err != nil {
		trace.Error(ctx, err)
	}
	return rows, err
}

func (db *DB) NamedQueryContext(ctx context.Context, query string, arg interface{}) (*sqlx.Rows, error) {
	ctx = trace.Start(ctx, "SQL query")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"sql.query": query,
	})

	rows, err := db.DB.NamedQueryContext(ctx, query, arg)
	if err != nil {
		trace.Error(ctx, err)
	}
	return rows, err
}
