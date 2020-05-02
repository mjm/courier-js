resource "auth0_client" "backend" {
  name     = "Courier Backend"
  app_type = "regular_web"

  custom_login_page_on = true
  is_first_party       = true
  oidc_conformant      = true

  grant_types = [
    "authorization_code",
    "implicit",
    "refresh_token",
    "client_credentials",
  ]

  jwt_configuration {
    alg                 = "RS256"
    lifetime_in_seconds = 36000
  }
}

resource "auth0_client" "frontend" {
  name     = "Courier"
  app_type = "spa"

  custom_login_page_on = true
  is_first_party       = true
  oidc_conformant      = true

  initiate_login_uri = "https://${var.site_domain}/login"
  callbacks = [
    "http://localhost:3000/logged-in",
    "https://${var.now_project}.now.sh/logged-in",
    "https://${var.now_project}.mjm.now.sh/logged-in",
    "https://${var.site_domain}/logged-in"
  ]
  allowed_logout_urls = [
    "http://localhost:3000",
    "https://${var.now_project}.now.sh",
    "https://${var.now_project}.mjm.now.sh",
    "https://${var.site_domain}"
  ]
  web_origins = [
    "http://localhost:3000",
    "https://${var.now_project}.now.sh",
    "https://${var.now_project}.mjm.now.sh",
    "https://${var.site_domain}"
  ]

  grant_types = [
    "authorization_code",
    "implicit",
    "refresh_token"
  ]

  jwt_configuration {
    alg                 = "RS256"
    lifetime_in_seconds = 36000
  }
}

resource "auth0_client" "ios" {
  name     = "Courier iOS"
  app_type = "native"

  custom_login_page_on = true
  is_first_party       = true
  oidc_conformant      = true

  callbacks = [
    "com.mattmoriarity.Courier://${var.auth_domain}/ios/com.mattmoriarity.Courier/callback",
  ]
  allowed_logout_urls = [
    "com.mattmoriarity.Courier://${var.auth_domain}/ios/com.mattmoriarity.Courier/callback"
  ]

  grant_types = [
    "authorization_code",
    "implicit",
    "refresh_token",
  ]

  jwt_configuration {
    alg                 = "RS256"
    lifetime_in_seconds = 36000
  }
}
