# user for functions that are accessing AWS resources outside of AWS
resource "aws_iam_user" "external_function" {
  name = "courier-external-function-user-${var.env}"

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

resource "aws_iam_user_policy_attachment" "external_function_table" {
  user       = aws_iam_user.external_function.name
  policy_arn = aws_iam_policy.courier_table.arn
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
