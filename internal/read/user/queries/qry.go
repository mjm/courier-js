package queries

const (
	// events.sql
	EventsPagerEdges = "SELECT * FROM events WHERE user_id = :user_id;"
	EventsPagerTotal = "SELECT COUNT(*) FROM events WHERE user_id = :user_id;"
	EventsRecord     = "INSERT INTO events (user_id, event_type, parameters) VALUES ($1, $2, $3);"
)
