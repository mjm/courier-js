resource "aws_api_gateway_rest_api" "courier" {
  name = "courier-${var.env}"

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

data "aws_iam_policy_document" "lambda_exec" {
  statement {
    actions = [
    "sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = [
      "lambda.amazonaws.com"]
    }
  }
}

resource "aws_api_gateway_resource" "pusherauth" {
  rest_api_id = aws_api_gateway_rest_api.courier.id
  parent_id   = aws_api_gateway_rest_api.courier.root_resource_id
  path_part   = "pusherauth"
}

resource "aws_api_gateway_method" "pusherauth" {
  rest_api_id   = aws_api_gateway_rest_api.courier.id
  resource_id   = aws_api_gateway_resource.pusherauth.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "pusherauth" {
  rest_api_id = aws_api_gateway_rest_api.courier.id
  resource_id = aws_api_gateway_method.pusherauth.resource_id
  http_method = aws_api_gateway_method.pusherauth.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.pusherauth.invoke_arn
}

resource "aws_api_gateway_deployment" "courier" {
  depends_on = [
    aws_api_gateway_integration.pusherauth,
  ]

  rest_api_id = aws_api_gateway_rest_api.courier.id
  stage_name  = var.env
}

output "base_url" {
  value = aws_api_gateway_deployment.courier.invoke_url
}
