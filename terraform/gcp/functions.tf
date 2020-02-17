resource "google_service_account" "function_graphql" {
  account_id   = "function-graphql"
  display_name = "Function: GraphQL"
  description  = "Runner for the GraphQL function"
}

resource "google_service_account" "function_events" {
  account_id   = "function-events"
  display_name = "Function: Events"
  description  = "Runner for the Events function"
}

resource "google_service_account" "function_post_queued_tweets" {
  account_id   = "function-post-queued-tweets"
  display_name = "Function: PostQueuedTweets"
  description  = "Runner for the PostQueuedTweets function"
}

resource "google_service_account" "function_indieauth_callback" {
  account_id   = "function-indieauth-callback"
  display_name = "Function: IndieAuthCallback"
  description  = "Runner for the IndieAuthCallback function"
}

locals {
  source_repo_url = "https://source.developers.google.com/projects/${var.project_id}/repos/${var.function_repo}/revisions/${var.function_revision}/paths/"

  function_env = {
    GCP_PROJECT  = var.project_id
    GCP_TOPIC_ID = google_pubsub_topic.events.name
  }
}

resource "google_cloudfunctions_function" "graphql" {
  name        = "graphql"
  description = "Serve GraphQL API requests"
  runtime     = "go113"
  entry_point = "GraphQL"

  source_repository {
    url = local.source_repo_url
  }

  service_account_email = google_service_account.function_graphql.email
  available_memory_mb   = 512

  trigger_http = true

  environment_variables = merge(var.function_env, local.function_env)

  depends_on = [
    google_project_service.services["cloudfunctions.googleapis.com"],
  ]
}

resource "google_cloudfunctions_function" "events" {
  name        = "events"
  description = "Handles events delivered via PubSub"
  runtime     = "go113"
  entry_point = "Events"

  source_repository {
    url = local.source_repo_url
  }

  service_account_email = google_service_account.function_events.email

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = google_pubsub_topic.events.id
  }

  environment_variables = merge(var.function_env, local.function_env)

  depends_on = [
    google_project_service.services["cloudfunctions.googleapis.com"],
  ]
}

resource "google_cloudfunctions_function" "post_queued_tweets" {
  name        = "post-queued-tweets"
  description = "Handles cron events to check for queued tweets to post to Twitter"
  runtime     = "go113"
  entry_point = "PostQueuedTweets"

  source_repository {
    url = local.source_repo_url
  }

  service_account_email = google_service_account.function_post_queued_tweets.email

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = google_pubsub_topic.post_queued_tweets.id
  }

  environment_variables = merge(var.function_env, local.function_env)

  depends_on = [
    google_project_service.services["cloudfunctions.googleapis.com"],
  ]
}

resource "google_cloudfunctions_function" "indieauth_callback" {
  name        = "indieauth-callback"
  description = "Handles callbacks to complete IndieAuth handshakes"
  runtime     = "go113"
  entry_point = "IndieAuthCallback"

  source_repository {
    url = local.source_repo_url
  }

  service_account_email = google_service_account.function_indieauth_callback.email

  trigger_http = true

  environment_variables = merge(var.function_env, local.function_env)

  depends_on = [
    google_project_service.services["cloudfunctions.googleapis.com"],
  ]
}
