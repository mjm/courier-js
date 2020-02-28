locals {
  base_env = {
    GCP_TOPIC_ID    = google_pubsub_topic.events.name
    GCP_TASKS_QUEUE = google_cloud_tasks_queue.tasks.id
  }
  non_tasks_env = {
    TASKS_URL = "https://${var.region}-${var.project_id}.cloudfunctions.net/tasks"
  }
  function_env = merge(local.base_env, var.function_env)
}

module "function_graphql" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = merge(local.function_env, local.non_tasks_env)

  name         = "graphql"
  description  = "Serve GraphQL API requests"
  entry_point  = "GraphQL"
  memory       = 512
  trigger_http = true
}

module "function_ping" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = merge(local.function_env, local.non_tasks_env)

  name         = "ping"
  description  = "Handle XML-RPC ping requests from blogs"
  entry_point  = "Ping"
  trigger_http = true
}

module "function_events" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = merge(local.function_env, local.non_tasks_env)

  name          = "events"
  description   = "Handles events delivered via PubSub"
  entry_point   = "Events"
  trigger_topic = google_pubsub_topic.events.id
}

module "function_post_queued_tweets" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = merge(local.function_env, local.non_tasks_env)

  name          = "post-queued-tweets"
  description   = "Handles cron events to check for queued tweets to post to Twitter"
  entry_point   = "PostQueuedTweets"
  trigger_topic = google_pubsub_topic.post_queued_tweets.id
}

module "function_indieauth_callback" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = merge(local.function_env, local.non_tasks_env)

  name         = "indieauth-callback"
  description  = "Handles callbacks to complete IndieAuth handshakes"
  entry_point  = "IndieAuthCallback"
  trigger_http = true
}

module "function_stripe_callback" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = merge(local.function_env, local.non_tasks_env)

  name         = "stripe-callback"
  description  = "Handles Stripe webhooks for events"
  entry_point  = "StripeCallback"
  trigger_http = true
}

module "function_pusher_auth" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = merge(local.function_env, local.non_tasks_env)

  name         = "pusher-auth"
  description  = "Handles authentication requests for private Pusher channels"
  entry_point  = "PusherAuth"
  trigger_http = true
}

module "function_tasks" {
  source       = "../modules/cloud_function"
  project_id   = var.project_id
  env          = var.env
  git_revision = var.function_revision
  env_vars     = local.function_env

  name         = "tasks"
  description  = "Runs delayed tasks"
  entry_point  = "Tasks"
  trigger_http = true
}

resource "google_cloudfunctions_function_iam_binding" "tasks" {
  cloud_function = module.function_tasks.name
  role           = "roles/cloudfunctions.invoker"

  members = [
    "allAuthenticatedUsers",
  ]
}

