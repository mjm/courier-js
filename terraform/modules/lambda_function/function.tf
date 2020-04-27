resource "aws_lambda_function" "fn" {
  function_name = "courier-${var.function_name}-${var.env}"
  handler       = var.function_name
  runtime       = "go1.x"
  role          = aws_iam_role.role.arn

  s3_bucket = var.s3_bucket
  s3_key    = "${var.revision}/${var.function_name}.zip"

  environment {
    variables = {
      APP_ENV           = "dev"
      PARAM_PATH_PREFIX = "/courier/${var.env}"
    }
  }

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}
