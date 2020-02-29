resource "google_cloud_tasks_queue" "tasks" {
  name     = "tasks-queue"
  location = "us-central1"

  depends_on = [
    google_project_service.services["cloudtasks.googleapis.com"]
  ]
}

resource "google_service_account" "task_creator" {
  account_id   = "task-creator"
  display_name = "Task Creator"
  description  = "Service account for creating Cloud Tasks"
}

resource "google_project_iam_binding" "cloud_tasks_enqueuer" {
  role = "roles/cloudtasks.enqueuer"
  members = [
    "serviceAccount:${google_service_account.task_creator.email}",
  ]
}

resource "google_project_iam_binding" "cloud_functions_invoker" {
  role = "roles/cloudfunctions.invoker"
  members = [
    "serviceAccount:${google_service_account.task_creator.email}",
  ]
}

data "google_iam_policy" "run_as_task_creator" {
  binding {
    role = "roles/iam.serviceAccountUser"
    members = [
      "serviceAccount:${module.function_graphql.service_account_email}",
      "serviceAccount:${module.function_events.service_account_email}",
      "serviceAccount:${module.function_ping.service_account_email}",
      "serviceAccount:${module.function_tasks.service_account_email}",
    ]
  }
}

resource "google_service_account_iam_policy" "run_as_task_creator" {
  service_account_id = google_service_account.task_creator.name
  policy_data        = data.google_iam_policy.run_as_task_creator.policy_data
}
