package db

import "github.com/jmoiron/sqlx"

// TestingDSN is a data source name that connects to the local testing database.
const TestingDSN = "dbname=courier_test sslmode=disable"

// NewTestingDB creates a new database connection pointed at the testing database.
func NewTestingDB() DB {
	return &tracingDB{DB: sqlx.MustOpen("postgres", TestingDSN)}
}
