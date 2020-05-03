data "aws_lambda_function" "current" {
  function_name = var.function_name
}

data "aws_api_gateway_rest_api" "current" {
  name = var.api_name
}

resource "aws_api_gateway_resource" "current" {
  rest_api_id = data.aws_api_gateway_rest_api.current.id
  parent_id   = data.aws_api_gateway_rest_api.current.root_resource_id
  path_part   = var.path_part
}

resource "aws_api_gateway_method" "current" {
  rest_api_id   = data.aws_api_gateway_rest_api.current.id
  resource_id   = aws_api_gateway_resource.current.id
  http_method   = var.http_method
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "current" {
  rest_api_id = data.aws_api_gateway_rest_api.current.id
  resource_id = aws_api_gateway_method.current.resource_id
  http_method = aws_api_gateway_method.current.http_method

  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = data.aws_lambda_function.current.invoke_arn
}

resource "aws_lambda_permission" "gateway_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${data.aws_api_gateway_rest_api.current.execution_arn}/*/*/*"
}
