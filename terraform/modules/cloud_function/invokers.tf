resource "google_cloud_run_service_iam_binding" "invokers" {
  location = google_cloud_run_service.function.location
  service  = google_cloud_run_service.function.name
  role     = "roles/run.invoker"
  members  = var.invokers
}
