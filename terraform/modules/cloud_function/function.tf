locals {
  source_repo_url = "https://source.developers.google.com/projects/${var.project_id}/repos/${var.repository}/revisions/${var.git_revision}/paths/"
  function_env = {
    APP_ENV        = var.env
    GOOGLE_PROJECT = var.project_id
  }
  event_triggers = var.trigger_topic == "" ? toset([]) : toset([
  var.trigger_topic])
}

//data "google_container_registry_image" "image" {
//  name = "courier-functions"
//  tag  = "git-${var.git_revision}"
//}
//
//resource "google_cloud_run_service" "function" {
//  name     = var.name
//  location = "us-central1"
//
//  spec {
//    containers {
//      image = data.google_container_registry_image.image.image_url
//      args  = [
//        var.name
//      ]
//
//      dynamic "env" {
//        for_each = merge(local.function_env, var.env_vars)
//        content {
//          key = env.key
//          value = env.value
//        }
//      }
//    }
//
//    service_account_name = google_service_account.function_account.email
//  }
//}

resource "google_cloudfunctions_function" "function" {
  name        = var.name
  description = var.description
  runtime     = "go113"
  entry_point = var.entry_point

  source_repository {
    url = local.source_repo_url
  }

  service_account_email = google_service_account.function_account.email
  available_memory_mb   = var.memory

  trigger_http = var.trigger_http
  dynamic "event_trigger" {
    for_each = local.event_triggers
    content {
      event_type = "google.pubsub.topic.publish"
      resource   = event_trigger.value
    }
  }

  environment_variables = merge(local.function_env, var.env_vars)
}
