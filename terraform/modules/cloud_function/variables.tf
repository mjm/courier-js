variable "project_id" {}
variable "env" {}
variable "name" {}
variable "description" {}
variable "entry_point" {}
variable "git_revision" {}

variable "trigger_http" {
  type    = bool
  default = null
}

variable "trigger_topic" {
  type    = string
  default = ""
}

variable "env_vars" {
  type    = map(string)
  default = {}
}

variable "memory" {
  default = 256
}

variable "repository" {
  default = "github_mjm_courier-js"
}

variable "invokers" {
  type    = list(string)
  default = ["allUsers"]
}
