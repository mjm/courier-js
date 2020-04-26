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

resource "aws_api_gateway_resource" "ping" {
  rest_api_id = aws_api_gateway_rest_api.courier.id
  parent_id   = aws_api_gateway_rest_api.courier.root_resource_id
  path_part   = "ping"
}

resource "aws_api_gateway_method" "ping" {
  rest_api_id   = aws_api_gateway_rest_api.courier.id
  resource_id   = aws_api_gateway_resource.ping.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "ping" {
  rest_api_id = aws_api_gateway_rest_api.courier.id
  resource_id = aws_api_gateway_method.ping.resource_id
  http_method = aws_api_gateway_method.ping.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.ping.invoke_arn
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

output "pusherauth_url" {
  value = "${aws_api_gateway_deployment.courier.invoke_url}${aws_api_gateway_resource.pusherauth.path}"
}

output "ping_url" {
  value = "${aws_api_gateway_deployment.courier.invoke_url}${aws_api_gateway_resource.ping.path}"
}

resource "aws_ssm_parameter" "dynamo_table_name" {
  name  = "/courier/${var.env}/db/table-name"
  type  = "String"
  value = aws_dynamodb_table.courier.name
}
