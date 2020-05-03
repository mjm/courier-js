resource "auth0_rule_config" "allowed_users" {
  key   = "ALLOWED_USERS"
  value = join(",", var.allowed_users)
}

resource "auth0_rule" "allowed_users" {
  name  = "Only allow certain users"
  order = 1
  # language=JavaScript
  script  = <<EOF
function (user, context, callback) {
  // if allowed user list is empty, all users are allowed
  if (!configuration.ALLOWED_USERS) {
    return callback(null, user, context)
  }

  const allowedUsers = configuration.ALLOWED_USERS.split(",")
  if (context.connection === 'twitter' && user.screen_name) {
    if (allowedUsers.includes(user.screen_name)) {
      return callback(null, user, context)
    }
  }

  return callback(new UnauthorizedError("This user is not allowed to login."))
}
EOF
  enabled = true
}

resource "auth0_rule" "screen_name" {
  name  = "Use Twitter screen name as nickname"
  order = 2
  # language=JavaScript
  script  = <<EOF
function (user, context, callback) {
  // Put the user's screen_name as the nickname
  // for Twitter connections
  if (context.connection === 'twitter' && user.screen_name) {
    user.nickname = user.screen_name;
  }
  callback(null, user, context);
}
EOF
  enabled = true
}

resource "auth0_rule" "subscription_info" {
  name  = "Include Stripe IDs in access token"
  order = 3
  # language=JavaScript
  script  = <<EOF
function (user, context, callback) {
  const namespace = "https://courier.blog/"
  const metadata = user.app_metadata || {}
  if (metadata.stripe_customer_id) {
    context.accessToken[namespace + "customer_id"] = metadata.stripe_customer_id
  }
  if (metadata.stripe_subscription_id) {
    context.accessToken[namespace + "subscription_id"] =
      metadata.stripe_subscription_id
  }
  if (metadata.subscription_status) {
    context.accessToken[namespace + "status"] = metadata.subscription_status
  }
  callback(null, user, context)
}
EOF
  enabled = true
}

resource "auth0_rule" "micropub_tokens" {
  name  = "Include sites for Micropub tokens in access token"
  order = 4
  # language=JavaScript
  script  = <<EOF
function (user, context, callback) {
  const namespace = "https://courier.blog/"
  const metadata = user.user_metadata || {}
  const tokens = metadata.micropub_tokens || {}
  context.accessToken[namespace + 'micropub_sites'] = Object.keys(tokens)
  callback(null, user, context)
}
EOF
  enabled = true
}

