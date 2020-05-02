resource "auth0_resource_server" "api" {
  name       = "Courier API"
  identifier = var.api_identifier

  skip_consent_for_verifiable_first_party_clients = true

  token_lifetime         = 86400
  token_lifetime_for_web = 7200
  signing_alg            = "RS256"
}