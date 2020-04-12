terraform {
  backend "remote" {
    organization = "courier"

    workspaces {
      prefix = "courier-"
    }
  }
}

provider "aws" {
  version = "~> 2.0"
  region  = var.region
}
