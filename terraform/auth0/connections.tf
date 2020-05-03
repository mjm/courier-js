resource "auth0_connection" "twitter" {
  name     = "twitter"
  strategy = "twitter"

  options {
    client_id     = var.twitter_client_id
    client_secret = var.twitter_client_secret
  }

  enabled_clients = [
    auth0_client.backend.client_id,
    auth0_client.frontend.client_id,
    auth0_client.ios.client_id,
    auth0_client.deploy_extension.client_id,
  ]
}
