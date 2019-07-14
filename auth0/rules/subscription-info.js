function (user, context, callback) {
  const namespace = "https://courier.blog/"
  if (user.app_metadata.stripe_customer_id) {
    context.accessToken[namespace + "customer_id"] =
      user.app_metadata.stripe_customer_id
  }
  if (user.app_metadata.stripe_subscription_id) {
    context.accessToken[namespace + "subscription_id"] =
      user.app_metadata.stripe_subscription_id
  }
  callback(null, user, context)
}
