variable "project_id" {}
variable "env" {}
variable "name" {}
variable "git_revision" {}

variable "env_vars" {
  type    = map(string)
  default = {}
}

variable "memory" {
  default = 256
}

variable "invokers" {
  type    = list(string)
  default = ["allUsers"]
}
