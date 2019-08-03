function (user, context, callback) {
  const namespace = "https://courier.blog/"
  const metadata = user.user_metadata || {}
  const tokens = metadata.micropub_tokens || {}
  context.accessToken[namespace + 'micropub_sites'] = Object.keys(tokens)
  callback(null, user, context)
}
