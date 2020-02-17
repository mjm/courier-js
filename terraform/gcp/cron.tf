resource "google_cloud_scheduler_job" "post_queued_tweets" {
  name        = "post-queued-tweets"
  description = "Check for queued tweets to post."
  schedule    = var.env == "staging" ? "*/5 * * * *" : "* * * * *"

  pubsub_target {
    topic_name = google_pubsub_topic.post_queued_tweets.name
  }
}

resource "google_pubsub_topic" "post_queued_tweets" {
  name = "post-queued-tweets"
}

resource "google_app_engine_application" "default" {
  name        = var.project_id
  location_id = "us-central"
}
