function (user, context, callback) {
  // Put the user's screen_name as the nickname
  // for Twitter connections
  if (context.connection === 'twitter' && user.screen_name) {
    user.nickname = user.screen_name;
  }
  callback(null, user, context);
}