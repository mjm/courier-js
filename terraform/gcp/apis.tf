locals {
  enabled_services = toset([
    "appengine.googleapis.com",
    "cloudfunctions.googleapis.com",
    "cloudkms.googleapis.com",
    "cloudscheduler.googleapis.com",
    "iam.googleapis.com",
    "pubsub.googleapis.com",
  ])
}

resource "google_project_service" "services" {
  for_each = local.enabled_services
  service  = each.key
}
