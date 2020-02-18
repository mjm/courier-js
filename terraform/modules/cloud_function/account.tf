resource "google_service_account" "function_account" {
  account_id   = "function-${var.name}"
  display_name = "Function: ${var.entry_point}"
  description  = "Runner for the ${var.entry_point} function"
}
