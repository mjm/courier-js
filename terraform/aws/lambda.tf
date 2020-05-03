resource "aws_s3_bucket" "lambda_handlers" {
  bucket = "courier-${var.env}-handlers"
  acl    = "private"

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

data "aws_s3_bucket_object" "lambda_manifest" {
  # always use production for this, since it's content addressable.
  # this lets us reuse the same handler zips between staging and production.
  bucket = local.lambda_bucket
  key    = "${var.function_revision}.json"
}

locals {
  lambda_bucket = "courier-production-handlers"
  function_keys = jsondecode(data.aws_s3_bucket_object.lambda_manifest.body)
}

module "graphql_function" {
  source = "../modules/lambda_function"

  function_name = "graphql"
  env           = var.env
  s3_bucket     = local.lambda_bucket
  s3_key        = local.function_keys["graphql"]
  policies = [
    aws_iam_policy.courier_table.arn,
    aws_iam_policy.config_params.arn,
    aws_iam_policy.enqueue_events.arn,
    aws_iam_policy.encrypt_micropub_token.arn,
  ]
}

module "pusherauth_function" {
  source = "../modules/lambda_function"

  function_name = "pusherauth"
  env           = var.env
  s3_bucket     = local.lambda_bucket
  s3_key        = local.function_keys["pusherauth"]
  policies = [
    aws_iam_policy.courier_table.arn,
    aws_iam_policy.config_params.arn,
  ]
}

module "events_function" {
  source = "../modules/lambda_function"

  function_name = "events"
  env           = var.env
  s3_bucket     = local.lambda_bucket
  s3_key        = local.function_keys["events"]
  timeout       = 60
  policies = [
    aws_iam_policy.courier_table.arn,
    aws_iam_policy.config_params.arn,
    aws_iam_policy.events_queue.arn,
    aws_iam_policy.enqueue_events.arn,
    aws_iam_policy.decrypt_micropub_token.arn,
  ]
}

module "ping_function" {
  source = "../modules/lambda_function"

  function_name = "ping"
  env           = var.env
  s3_bucket     = local.lambda_bucket
  s3_key        = local.function_keys["ping"]
  policies = [
    aws_iam_policy.courier_table.arn,
    aws_iam_policy.config_params.arn,
    aws_iam_policy.enqueue_events.arn,
  ]
}

module "stripecb_function" {
  source = "../modules/lambda_function"

  function_name = "stripecb"
  env           = var.env
  s3_bucket     = local.lambda_bucket
  s3_key        = local.function_keys["stripecb"]
  policies = [
    aws_iam_policy.courier_table.arn,
    aws_iam_policy.config_params.arn,
    aws_iam_policy.enqueue_events.arn,
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
