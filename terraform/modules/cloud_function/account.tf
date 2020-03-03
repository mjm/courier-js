resource "google_service_account" "function_account" {
  account_id   = "function-${var.name}"
  display_name = "Function: ${var.name}"
  description  = "Runner for the ${var.name} function"
}
