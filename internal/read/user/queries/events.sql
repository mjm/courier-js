-- qry: EventsRecord
INSERT INTO
  events
  (user_id, event_type, parameters)
VALUES
  ($1, $2, $3);
