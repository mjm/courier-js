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
  available_memory_mb = 512

  trigger_http = true

  // TODO pull out into variables so they can be different in prod
  environment_variables = {
    GCP_PROJECT = var.project_id
    GCP_TOPIC_ID = google_pubsub_topic.events.name
    APNS_CERTIFICATE = "courier-push-dev.p12"
    BACKEND_CLIENT_ID = "0Nmf4ZNfZzptwYBl7sbvPKdxFAH1d1re"
    CLIENT_ID = "OtyKJMJBiL09j2OAcX6yENl07rMDGx1l"
    AUTH_DOMAIN = "courier-staging.auth0.com"
    API_IDENTIFIER = "https://courier.mjm.now.sh/api/"
    MONTHLY_PLAN_ID = "plan_DdvIUmVUiibVMa"
    STRIPE_PUBLISHABLE_KEY = "pk_test_P2pW0N6UFzp1OY5In8KApmxj"
    HONEY_DATASET = "courier-staging"
  }
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

  // TODO pull out into variables so they can be different in prod
  environment_variables = {
    GCP_PROJECT = var.project_id
    GCP_TOPIC_ID = google_pubsub_topic.events.name
    APNS_CERTIFICATE = "courier-push-dev.p12"
    BACKEND_CLIENT_ID = "0Nmf4ZNfZzptwYBl7sbvPKdxFAH1d1re"
    CLIENT_ID = "OtyKJMJBiL09j2OAcX6yENl07rMDGx1l"
    AUTH_DOMAIN = "courier-staging.auth0.com"
    API_IDENTIFIER = "https://courier.mjm.now.sh/api/"
    MONTHLY_PLAN_ID = "plan_DdvIUmVUiibVMa"
    STRIPE_PUBLISHABLE_KEY = "pk_test_P2pW0N6UFzp1OY5In8KApmxj"
    HONEY_DATASET = "courier-staging"
  }
}
