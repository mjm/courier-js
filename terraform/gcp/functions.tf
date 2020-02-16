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
}
