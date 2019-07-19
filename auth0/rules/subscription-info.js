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
