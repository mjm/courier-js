locals {
  base_env = {
    GCP_TOPIC_ID          = google_pubsub_topic.events.name
    GCP_TASKS_QUEUE       = google_cloud_tasks_queue.tasks.id
    TASKS_SERVICE_ACCOUNT = google_service_account.task_creator.email
  }
  function_env = merge(local.base_env, var.function_env)
}

module "function_graphql" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = local.function_env

  name   = "graphql"
  memory = 512
}

module "function_ping" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = local.function_env

  name = "ping"
}

module "function_events" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = local.function_env

  name = "events"
  //  invokers = [
  //    "allAuthenticatedUsers"
  //  ]
}

module "function_stripe_callback" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = local.function_env

  name = "stripe-callback"
}

module "function_pusher_auth" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = local.function_env

  name = "pusher-auth"
}

module "function_tasks" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = local.function_env

  name = "tasks"
  invokers = [
    "allAuthenticatedUsers"
  ]
}
