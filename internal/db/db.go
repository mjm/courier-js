package db

import (
	"context"
	"database/sql"

	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/trace"

	// ensure the postgres driver is present
	_ "github.com/lib/pq"
)

// Config is configuration for the application's database.
type Config struct {
	URL string
}

// DB is an interface of supported operations for performing SQL queries.
type DB interface {
	ExecContext(context.Context, string, ...interface{}) (sql.Result, error)
	NamedQueryContext(context.Context, string, interface{}) (*sqlx.Rows, error)
	QueryxContext(context.Context, string, ...interface{}) (*sqlx.Rows, error)
	QueryRowxContext(context.Context, string, ...interface{}) *sqlx.Row
}

type tracingDB struct {
	DB *sqlx.DB
}

// New creates a new database connection for the application.
func New(cfg Config) (DB, error) {
	db, err := sqlx.Open("postgres", cfg.URL)
	if err != nil {
		return nil, err
	}

	return &tracingDB{DB: db}, nil
}

func (db *tracingDB) ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	ctx = trace.Start(ctx, "SQL query")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"sql.query": query,
	})

	res, err := db.DB.ExecContext(ctx, query, args...)
	if err != nil {
		trace.Error(ctx, err)
	}
	return res, err
}

func (db *tracingDB) QueryxContext(ctx context.Context, query string, args ...interface{}) (*sqlx.Rows, error) {
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

func (db *tracingDB) QueryRowxContext(ctx context.Context, query string, args ...interface{}) *sqlx.Row {
	ctx = trace.Start(ctx, "SQL query")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"sql.query": query,
	})

	row := db.DB.QueryRowxContext(ctx, query, args...)
	if row.Err() != nil {
		trace.Error(ctx, row.Err())
	}
	return row
}

func (db *tracingDB) NamedQueryContext(ctx context.Context, query string, arg interface{}) (*sqlx.Rows, error) {
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