exports.up = pgm => {
  pgm.createType("tweet_action", ["tweet", "retweet"])

  pgm.addColumns("tweets", {
    action: {
      type: "tweet_action",
      notNull: true,
      default: "tweet",
    },
    retweet_id: {
      type: "text",
      notNull: true,
      default: "",
    },
  })
}
