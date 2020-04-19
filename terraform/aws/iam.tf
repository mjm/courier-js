# user for functions that are accessing AWS resources outside of AWS
resource "aws_iam_user" "external_function" {
  name = "courier-external-function-user-${var.env}"

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

data "aws_iam_policy_document" "external_function" {
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

resource "aws_iam_user_policy" "external_function" {
  name = "external-function-policy"
  user = aws_iam_user.external_function.name

  policy = data.aws_iam_policy_document.external_function.json
}

resource "aws_iam_access_key" "external_function" {
  user    = aws_iam_user.external_function.name
  pgp_key = "keybase:${var.keybase_username}"
}

output "external_function_access_key_id" {
  value = aws_iam_access_key.external_function.id
}

output "external_function_secret_access_key" {
  value = aws_iam_access_key.external_function.encrypted_secret
}
