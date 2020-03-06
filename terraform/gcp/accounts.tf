resource "google_project_iam_binding" "owner" {
  role = "roles/owner"
  members = [
    "user:matt@mattmoriarity.com",
  ]
}

locals {
  function_accounts = [
    "serviceAccount:${module.function_graphql.service_account_email}",
    "serviceAccount:${module.function_ping.service_account_email}",
    "serviceAccount:${module.function_events.service_account_email}",
    "serviceAccount:${module.function_indieauth_callback.service_account_email}",
    "serviceAccount:${module.function_stripe_callback.service_account_email}",
    "serviceAccount:${module.function_pusher_auth.service_account_email}",
    "serviceAccount:${module.function_tasks.service_account_email}",
  ]

  dev_account = var.env == "staging" ? [
    "serviceAccount:matt-laptop-dev@${var.project_id}.iam.gserviceaccount.com"
  ] : []

  all_function_accounts = concat(local.function_accounts, local.dev_account)
}

resource "google_project_iam_binding" "secret_manager_secret_accessor" {
  role    = "roles/secretmanager.secretAccessor"
  members = local.all_function_accounts
}
