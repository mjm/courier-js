resource "aws_s3_bucket" "lambda_handlers" {
  bucket = "courier-${var.env}-handlers"
  acl    = "private"

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

module "pusherauth_function" {
  source = "../modules/lambda_function"

  function_name = "pusherauth"
  env           = var.env
  s3_bucket     = aws_s3_bucket.lambda_handlers.bucket
  revision      = var.function_revision
  policies = [
    aws_iam_policy.courier_table.arn,
    aws_iam_policy.config_params.arn,
  ]
}

resource "aws_lambda_permission" "pusherauth_apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.pusherauth_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.courier.execution_arn}/*/*/*"
}

module "events_function" {
  source = "../modules/lambda_function"

  function_name = "events"
  env           = var.env
  s3_bucket     = aws_s3_bucket.lambda_handlers.bucket
  revision      = var.function_revision
  policies = [
    aws_iam_policy.courier_table.arn,
    aws_iam_policy.config_params.arn,
    aws_iam_policy.events_queue.arn,
  ]
}

module "ping_function" {
  source = "../modules/lambda_function"

  function_name = "ping"
  env           = var.env
  s3_bucket     = aws_s3_bucket.lambda_handlers.bucket
  revision      = var.function_revision
  policies = [
    aws_iam_policy.courier_table.arn,
    aws_iam_policy.config_params.arn,
  ]
}

data "aws_iam_policy_document" "events_queue" {
  statement {
    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",
    ]
    resources = [
      aws_sqs_queue.events.arn
    ]
  }
}

resource "aws_iam_policy" "events_queue" {
  name   = "courier-${var.env}-events-queue"
  policy = data.aws_iam_policy_document.events_queue.json
}

resource "aws_lambda_permission" "ping_apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.ping_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.courier.execution_arn}/*/*/*"
}
