package queries

const (
	// feeds.sql
	FeedsGetByURL = "SELECT * FROM feeds WHERE url = $1;"
	FeedsCreate   = "INSERT INTO feeds (guid, url) VALUES ($1, $2) RETURNING id;"
)
