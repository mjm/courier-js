locals {
  enabled_services = toset([
    "cloudfunctions.googleapis.com",
    "cloudscheduler.googleapis.com",
    "iam.googleapis.com",
    "pubsub.googleapis.com",
  ])
}

resource "google_project_service" "services" {
  for_each = local.enabled_services
  service  = each.key
}
