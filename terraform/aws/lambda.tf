resource "aws_s3_bucket" "lambda_handlers" {
  bucket = "courier-${var.env}-handlers"
  acl    = "private"

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

resource "aws_lambda_permission" "pusherauth_apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.pusherauth.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.courier.execution_arn}/*/*/*"
}

resource "aws_iam_role" "pusherauth" {
  name               = "courier-pusherauth-${var.env}"
  assume_role_policy = data.aws_iam_policy_document.lambda_exec.json

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

resource "aws_iam_role_policy_attachment" "pusherauth_basic" {
  role       = aws_iam_role.pusherauth.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "pusherauth_table" {
  role       = aws_iam_role.pusherauth.name
  policy_arn = aws_iam_policy.courier_table.arn
}

resource "aws_iam_role_policy_attachment" "pusherauth_config" {
  role       = aws_iam_role.pusherauth.name
  policy_arn = aws_iam_policy.config_params.arn
}

resource "aws_lambda_function" "pusherauth" {
  function_name = "pusherauth-${var.env}"
  handler       = "pusherauth"
  runtime       = "go1.x"
  role          = aws_iam_role.pusherauth.arn

  s3_bucket = aws_s3_bucket.lambda_handlers.bucket
  s3_key    = "${var.function_revision}/pusherauth.zip"

  environment {
    variables = {
      PARAM_PATH_PREFIX = "/courier/${var.env}"
    }
  }

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

resource "aws_iam_role" "events" {
  name               = "courier-events-${var.env}"
  assume_role_policy = data.aws_iam_policy_document.lambda_exec.json

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

resource "aws_iam_role_policy_attachment" "events_basic" {
  role       = aws_iam_role.events.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "events_table" {
  role       = aws_iam_role.events.name
  policy_arn = aws_iam_policy.courier_table.arn
}

resource "aws_iam_role_policy_attachment" "events_config" {
  role       = aws_iam_role.events.name
  policy_arn = aws_iam_policy.config_params.arn
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

resource "aws_iam_role_policy" "events_queue" {
  role   = aws_iam_role.events.id
  policy = data.aws_iam_policy_document.events_queue.json
}

resource "aws_lambda_function" "events" {
  function_name = "pusherauth-${var.env}"
  handler       = "pusherauth"
  runtime       = "go1.x"
  role          = aws_iam_role.events.arn

  s3_bucket = aws_s3_bucket.lambda_handlers.bucket
  s3_key    = "${var.function_revision}/events.zip"

  environment {
    variables = {
      PARAM_PATH_PREFIX = "/courier/${var.env}"
    }
  }

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}
