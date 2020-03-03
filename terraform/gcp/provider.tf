terraform {
  backend "remote" {
    organization = "courier"

    workspaces {
      prefix = "courier-"
    }
  }
}

provider "google" {
  credentials = var.gcp_credentials
  project     = var.project_id
  region      = var.region
}
