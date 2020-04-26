resource "aws_dynamodb_table" "courier" {
  name         = "courier-${var.env}"
  billing_mode = "PAY_PER_REQUEST"

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
  attribute {
    name = "GSI2PK"
    type = "S"
  }
  attribute {
    name = "GSI2SK"
    type = "S"
  }
  attribute {
    name = "LSI1SK"
    type = "S"
  }

  local_secondary_index {
    name            = "LSI1"
    range_key       = "LSI1SK"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "GSI1"
    hash_key        = "GSI1PK"
    range_key       = "GSI1SK"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "GSI2"
    hash_key        = "GSI2PK"
    range_key       = "GSI2SK"
    projection_type = "ALL"
  }

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

data "aws_iam_policy_document" "courier_table" {
  statement {
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem",
    ]

    resources = [
      aws_dynamodb_table.courier.arn,
      "${aws_dynamodb_table.courier.arn}/index/*",
    ]
  }
}

resource "aws_iam_policy" "courier_table" {
  name   = "courier-${var.env}-dynamo-table"
  policy = data.aws_iam_policy_document.courier_table.json
}
