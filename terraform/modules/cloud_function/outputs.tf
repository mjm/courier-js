output "name" {
  value = google_cloud_run_service.function.name
}

output "service_account_email" {
  value = google_service_account.function_account.email
}

output "https_url" {
  value = google_cloud_run_service.function.status[0].url
}
