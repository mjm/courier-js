module "function_graphql" {
  source            = "../modules/cloud_function"
  project_id        = var.project_id
  env               = var.env
  git_revision      = var.function_revision
  env_vars          = var.function_env
  events_topic_name = google_pubsub_topic.events.name

  name         = "graphql"
  description  = "Serve GraphQL API requests"
  entry_point  = "GraphQL"
  memory       = 512
  trigger_http = true
}

module "function_events" {
  source            = "../modules/cloud_function"
  project_id        = var.project_id
  env               = var.env
  git_revision      = var.function_revision
  env_vars          = var.function_env
  events_topic_name = google_pubsub_topic.events.name

  name          = "events"
  description   = "Handles events delivered via PubSub"
  entry_point   = "Events"
  trigger_topic = google_pubsub_topic.events.id
}

module "function_post_queued_tweets" {
  source            = "../modules/cloud_function"
  project_id        = var.project_id
  env               = var.env
  git_revision      = var.function_revision
  env_vars          = var.function_env
  events_topic_name = google_pubsub_topic.events.name

  name          = "post-queued-tweets"
  description   = "Handles cron events to check for queued tweets to post to Twitter"
  entry_point   = "PostQueuedTweets"
  trigger_topic = google_pubsub_topic.post_queued_tweets.id
}

module "function_indieauth_callback" {
  source            = "../modules/cloud_function"
  project_id        = var.project_id
  env               = var.env
  git_revision      = var.function_revision
  env_vars          = var.function_env
  events_topic_name = google_pubsub_topic.events.name

  name         = "indieauth-callback"
  description  = "Handles callbacks to complete IndieAuth handshakes"
  entry_point  = "IndieAuthCallback"
  trigger_http = true
}

module "function_stripe_callback" {
  source            = "../modules/cloud_function"
  project_id        = var.project_id
  env               = var.env
  git_revision      = var.function_revision
  env_vars          = var.function_env
  events_topic_name = google_pubsub_topic.events.name

  name         = "stripe-callback"
  description  = "Handles Stripe webhooks for events"
  entry_point  = "StripeCallback"
  trigger_http = true
}

module "function_pusher_auth" {
  source            = "../modules/cloud_function"
  project_id        = var.project_id
  env               = var.env
  git_revision      = var.function_revision
  env_vars          = var.function_env
  events_topic_name = google_pubsub_topic.events.name

  name         = "pusher-auth"
  description  = "Handles authentication requests for private Pusher channels"
  entry_point  = "PusherAuth"
  trigger_http = true
}
