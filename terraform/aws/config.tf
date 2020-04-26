data "aws_iam_policy_document" "config_params" {
  statement {
    actions = [
      "ssm:GetParameter*",
    ]
    resources = [
      "arn:aws:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter/courier/${var.env}/*",
    ]
  }
}

resource "aws_iam_policy" "config_params" {
  name   = "courier-${var.env}-config-params"
  policy = data.aws_iam_policy_document.config_params
}
