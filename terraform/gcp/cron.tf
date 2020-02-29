resource "google_app_engine_application" "default" {
  project     = var.project_id
  location_id = "us-central"

  depends_on = [
    google_project_service.services["appengine.googleapis.com"],
  ]
}
