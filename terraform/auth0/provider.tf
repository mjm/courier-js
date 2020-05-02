terraform {
  backend "remote" {
    organization = "courier"

    workspaces {
      prefix = "courier-"
    }
  }
}

provider "auth0" {}
