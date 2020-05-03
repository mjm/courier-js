data "aws_iam_policy_document" "lambda_exec" {
  statement {
    actions = [
      "sts:AssumeRole"
    ]

    principals {
      type = "Service"
      identifiers = [
        "lambda.amazonaws.com"
      ]
    }
  }
}

resource "aws_iam_role" "role" {
  name               = "courier-${var.function_name}-${var.env}"
  assume_role_policy = data.aws_iam_policy_document.lambda_exec.json

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

resource "aws_iam_role_policy_attachment" "basic" {
  role       = aws_iam_role.role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "policies" {
  for_each = toset(var.policies)

  role       = aws_iam_role.role.name
  policy_arn = each.value
}
