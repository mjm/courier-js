resource "google_service_account" "circleci_deployer" {
  account_id   = "circleci-deployer"
  display_name = "CircleCI Deployer"
  description  = "Account for deploying functions from CircleCI"
}

resource "google_project_iam_binding" "owner" {
  role    = "roles/owner"
  members = [
    "user:matt@mattmoriarity.com",
  ]
}

resource "google_project_iam_binding" "cloud_functions_developer" {
  role    = "roles/cloudfunctions.developer"
  members = [
    "serviceAccount:${google_service_account.circleci_deployer.email}",
  ]
}

resource "google_project_iam_binding" "pubsub_publisher" {
  role    = "roles/pubsub.publisher"
  members = [
    "serviceAccount:${google_service_account.function_graphql.email}",
    "serviceAccount:${google_service_account.function_post_queued_tweets.email}",
  ]
}

resource "google_project_iam_binding" "pubsub_subscriber" {
  role    = "roles/pubsub.subscriber"
  members = [
    "serviceAccount:${google_service_account.function_events.email}",
  ]
}

locals {
  function_accounts = [
    "serviceAccount:${google_service_account.function_graphql.email}",
    "serviceAccount:${google_service_account.function_events.email}",
    "serviceAccount:${google_service_account.function_post_queued_tweets.email}",
  ]

  dev_account = "serviceAccount:matt-laptop-dev@${var.project_id}.iam.gserviceaccount.com"

  all_function_accounts = var.env == "staging" ? concat(local.function_accounts, [local.dev_account]) : local.function_accounts
}

resource "google_project_iam_binding" "secret_manager_secret_accessor" {
  role    = "roles/secretmanager.secretAccessor"
  members = local.all_function_accounts
}
