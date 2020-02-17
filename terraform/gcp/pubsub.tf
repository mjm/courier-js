resource "google_pubsub_topic" "events" {
  name = "events"

  depends_on = [
    google_project_service.services["pubsub.googleapis.com"],
  ]
}
