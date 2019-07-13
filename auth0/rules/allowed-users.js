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