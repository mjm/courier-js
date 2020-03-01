resource "google_storage_bucket" "build_cache" {
  name     = "courier-${var.env}-build-cache"
  location = "US-EAST1"

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age = 30
    }
  }
}
