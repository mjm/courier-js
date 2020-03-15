package db

import (
	"context"
	"database/sql"
	"reflect"

	"github.com/google/wire"
	"github.com/jmoiron/sqlx"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/config"

	// ensure the postgres driver is present
	_ "github.com/lib/pq"
)

var DefaultSet = wire.NewSet(New, NewConfig)

// Config is configuration for the application's database.
type Config struct {
	URL string `secret:"database-url"`
}

// DB is an interface of supported operations for performing SQL queries.
type DB interface {
	SelectContext(context.Context, interface{}, string, ...interface{}) error
	ExecContext(context.Context, string, ...interface{}) (sql.Result, error)
	NamedQueryContext(context.Context, string, interface{}) (*sqlx.Rows, error)
	QueryxContext(context.Context, string, ...interface{}) (*sqlx.Rows, error)
	QueryRowxContext(context.Context, string, ...interface{}) *sqlx.Row
}

var tracer = global.TraceProvider().Tracer("courier.blog/internal/db")

var (
	typeKey      = key.New("db.type").String
	statementKey = key.New("db.statement").String
	rowCountKey  = key.New("db.row_count").Int
)

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

func NewConfig(l *config.Loader) (cfg Config, err error) {
	err = l.Load(context.Background(), &cfg)
	return
}

func (db *tracingDB) SelectContext(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	ctx, span := tracer.Start(ctx, "db.SelectContext",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(typeKey("sql"), statementKey(query)))
	defer span.End()

	if err := db.DB.SelectContext(ctx, dest, query, args...); err != nil {
		span.RecordError(ctx, err)
		return err
	}

	span.SetAttributes(rowCountKey(reflect.ValueOf(dest).Elem().Len()))
	return nil
}

func (db *tracingDB) ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	ctx, span := tracer.Start(ctx, "db.ExecContext",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(typeKey("sql"), statementKey(query)))
	defer span.End()

	res, err := db.DB.ExecContext(ctx, query, args...)
	if err != nil {
		span.RecordError(ctx, err)
	}
	return res, err
}

func (db *tracingDB) QueryxContext(ctx context.Context, query string, args ...interface{}) (*sqlx.Rows, error) {
	ctx, span := tracer.Start(ctx, "db.QueryxContext",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(typeKey("sql"), statementKey(query)))
	defer span.End()

	rows, err := db.DB.QueryxContext(ctx, query, args...)
	if err != nil {
		span.RecordError(ctx, err)
	}
	return rows, err
}

func (db *tracingDB) QueryRowxContext(ctx context.Context, query string, args ...interface{}) *sqlx.Row {
	ctx, span := tracer.Start(ctx, "db.QueryRowxContext",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(typeKey("sql"), statementKey(query)))
	defer span.End()

	row := db.DB.QueryRowxContext(ctx, query, args...)
	if row.Err() != nil {
		span.RecordError(ctx, row.Err())
	}
	return row
}

func (db *tracingDB) NamedQueryContext(ctx context.Context, query string, arg interface{}) (*sqlx.Rows, error) {
	ctx, span := tracer.Start(ctx, "db.NamedQueryContext",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(typeKey("sql"), statementKey(query)))
	defer span.End()

	rows, err := db.DB.NamedQueryContext(ctx, query, arg)
	if err != nil {
		span.RecordError(ctx, err)
	}
	return rows, err
}
