resource "aws_api_gateway_rest_api" "courier" {
  name = "courier-${var.env}"

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

module "graphql_api" {
  source = "../modules/lambda_api_method"

  api_name      = aws_api_gateway_rest_api.courier.name
  function_name = module.graphql_function.function_name
  http_method   = "ANY"
  path_part     = "graphql"
}

module "pusherauth_api" {
  source = "../modules/lambda_api_method"

  api_name      = aws_api_gateway_rest_api.courier.name
  function_name = module.pusherauth_function.function_name
  http_method   = "ANY"
  path_part     = "pusherauth"
}

module "ping_api" {
  source = "../modules/lambda_api_method"

  api_name      = aws_api_gateway_rest_api.courier.name
  function_name = module.ping_function.function_name
  http_method   = "POST"
  path_part     = "ping"
}

resource "aws_api_gateway_deployment" "courier" {
  depends_on = [
    module.pusherauth_api,
    module.ping_api,
  ]

  rest_api_id = aws_api_gateway_rest_api.courier.id
  stage_name  = var.env
}

output "base_url" {
  value = aws_api_gateway_deployment.courier.invoke_url
}

output "pusherauth_url" {
  value = "${aws_api_gateway_deployment.courier.invoke_url}${module.pusherauth_api.path}"
}

output "ping_url" {
  value = "${aws_api_gateway_deployment.courier.invoke_url}${module.ping_api.path}"
}
