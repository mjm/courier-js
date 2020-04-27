resource "aws_kms_key" "micropub_token" {
  description = "Encrypt users' micropub tokens in Auth0 (${var.env})"
}

resource "aws_kms_alias" "micropub_token" {
  name          = "alias/courier/${var.env}/micropub-token"
  target_key_id = aws_kms_key.micropub_token.id
}

resource "aws_ssm_parameter" "micropub_token_key_arn" {
  name  = "/courier/${var.env}/auth/micropub-token-key"
  type  = "String"
  value = aws_kms_alias.micropub_token.arn
}
