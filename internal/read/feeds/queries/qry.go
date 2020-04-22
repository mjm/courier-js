package queries

const (
	// feeds.sql
	FeedsLoad = "SELECT * FROM feeds WHERE guid = ANY ($1);"

	// posts.sql
	PostsPagerEdges = "SELECT * FROM posts WHERE feed_guid = :feed_id;"
	PostsPagerTotal = "SELECT COUNT(*) FROM posts WHERE feed_guid = :feed_id;"
)
