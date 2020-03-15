locals {
  function_env = {
    APP_ENV        = var.env
    GOOGLE_PROJECT = var.project_id
  }
}

data "google_container_registry_image" "image" {
  name = "courier-functions"
  tag  = "git-${var.git_revision}"
}

resource "google_cloud_run_service" "function" {
  name     = var.name
  location = "us-central1"

  template {
    spec {
      containers {
        image = data.google_container_registry_image.image.image_url
        args = [
          var.name
        ]

        dynamic "env" {
          for_each = merge(local.function_env, var.env_vars)
          content {
            name  = env.key
            value = env.value
          }
        }
      }

      service_account_name = google_service_account.function_account.email
    }
  }
}
