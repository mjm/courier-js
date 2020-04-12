resource "aws_dynamodb_table" "courier" {
  name           = "courier-${var.env}"
  billing_mode   = "PROVISIONED"
  read_capacity  = var.env == "prod" ? 5 : 3
  write_capacity = var.env == "prod" ? 5 : 3

  hash_key  = "PK"
  range_key = "SK"

  attribute {
    name = "PK"
    type = "S"
  }
  attribute {
    name = "SK"
    type = "S"
  }
  attribute {
    name = "GSI1PK"
    type = "S"
  }
  attribute {
    name = "GSI1SK"
    type = "S"
  }

  global_secondary_index {
    name           = "GSI1"
    read_capacity  = var.env == "prod" ? 5 : 3
    write_capacity = var.env == "prod" ? 5 : 3

    hash_key        = "GSI1PK"
    range_key       = "GSI1SK"
    projection_type = "ALL"
  }

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}
