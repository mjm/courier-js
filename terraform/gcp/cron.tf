resource "google_cloud_scheduler_job" "post_queued_tweets" {
  name        = "post-queued-tweets"
  description = "Check for queued tweets to post."
  schedule    = var.env == "staging" ? "*/5 * * * *" : "* * * * *"

  pubsub_target {
    topic_name = google_pubsub_topic.post_queued_tweets.id
  }

  depends_on = [
    google_project_service.services["cloudscheduler.googleapis.com"],
    google_app_engine_application.default,
  ]
}

resource "google_pubsub_topic" "post_queued_tweets" {
  name = "post-queued-tweets"

  depends_on = [
    google_project_service.services["pubsub.googleapis.com"],
  ]
}

resource "google_app_engine_application" "default" {
  project     = var.project_id
  location_id = "us-central"

  depends_on = [
    google_project_service.services["appengine.googleapis.com"],
  ]
}
