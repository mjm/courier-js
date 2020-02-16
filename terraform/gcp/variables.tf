variable "env" {
  default = "staging"
}

variable "project_id" {
  type = string
}

variable "region" {
  default = "us-central1"
}

variable "gcp_credentials" {
  type = string
}

variable "function_repo" {
  default = "github_mjm_courier-js"
}

variable "function_revision" {
  type = string
}
