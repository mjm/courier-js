variable "function_name" {
  type = string
}

variable "env" {
  type = string
}

variable "s3_bucket" {
  type = string
}

variable "revision" {
  type = string
}

variable "policies" {
  type    = list(string)
  default = []
}
