output "name" {
  value = google_cloudfunctions_function.function.name
}

output "service_account_email" {
  value = google_service_account.function_account.email
}

output "https_url" {
  value = google_cloud_run_service.function.status.url
}
