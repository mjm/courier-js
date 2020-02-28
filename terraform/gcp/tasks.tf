resource "google_cloud_tasks_queue" "tasks" {
  name     = "tasks-queue"
  location = "us-central1"

  depends_on = [
    google_project_service.services["cloudtasks.googleapis.com"]
  ]
}
