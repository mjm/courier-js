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

variable "timeout" {
  type    = number
  default = 10
}

variable "policies" {
  type    = list(string)
  default = []
}
