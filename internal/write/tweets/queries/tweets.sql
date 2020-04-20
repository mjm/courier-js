-- qry: TweetsQueuePost
UPDATE tweets
SET
  post_after     = CURRENT_TIMESTAMP,
  post_task_name = $2,
  updated_at     = CURRENT_TIMESTAMP
WHERE guid = $1
  AND status = 'draft';
