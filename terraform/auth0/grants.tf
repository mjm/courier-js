resource "auth0_client_grant" "backend" {
  client_id = auth0_client.backend.id
  audience  = "https://${var.auth_domain}/api/v2/"
  scope = [
    "read:users",
    "read:user_idp_tokens",
    "update:users_app_metadata",
    "update:users",
  ]
}
