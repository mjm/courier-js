package db

import "github.com/jmoiron/sqlx"

const TestingDSN = "dbname=courier_test sslmode=disable"

func NewTestingDB() *DB {
	return &DB{sqlx.MustOpen("postgres", TestingDSN)}
}
