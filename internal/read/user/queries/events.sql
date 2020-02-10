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
