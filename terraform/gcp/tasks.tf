resource "google_cloud_tasks_queue" "tasks" {
  name     = "tasks-queue"
  location = "us-central1"
}
