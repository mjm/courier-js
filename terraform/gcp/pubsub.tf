resource "google_pubsub_topic" "events" {
  name = "events"

  depends_on = [
    google_project_service.services["pubsub.googleapis.com"],
  ]
}

resource "google_project_iam_binding" "pubsub_publisher" {
  role = "roles/pubsub.publisher"
  members = [
    "serviceAccount:${module.function_graphql.service_account_email}",
    "serviceAccount:${module.function_ping.service_account_email}",
    "serviceAccount:${module.function_post_queued_tweets.service_account_email}",
    "serviceAccount:${module.function_indieauth_callback.service_account_email}",
    "serviceAccount:${module.function_stripe_callback.service_account_email}",
    "serviceAccount:${module.function_tasks.service_account_email}",
  ]
}

resource "google_project_iam_binding" "pubsub_subscriber" {
  role = "roles/pubsub.subscriber"
  members = [
    "serviceAccount:${module.function_events.service_account_email}",
  ]
}

