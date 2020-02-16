-- qry: EventsPagerEdges
SELECT *
FROM
  events
WHERE user_id = :user_id;

-- qry: EventsPagerTotal
SELECT
  COUNT(*)
FROM
  events
WHERE user_id = :user_id;

-- qry: EventsRecord
INSERT INTO
  events
  (user_id, event_type, parameters)
VALUES
  ($1, $2, $3);
