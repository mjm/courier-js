exports.shorthands = undefined

exports.up = pgm => {
  pgm.createType("tweet_status", ["draft", "canceled", "posted"])

  pgm.createTable("tweets", {
    id: "id",
    post_id: {
      type: "bigint",
      notNull: true,
      references: '"posts"',
      // we should never delete posts, but especially don't do it if they have tweets made from them
      onDelete: "restrict",
    },
    feed_subscription_id: {
      type: "bigint",
      notNull: true,
      references: '"feed_subscriptions"',
      // same as above: subscriptions shouldn't be deleted anyway, but it's important that we don't do it if there are tweets
      onDelete: "restrict",
    },
    body: {
      type: "text",
      notNull: true,
      default: "",
    },
    media_urls: {
      type: "text[]",
      notNull: true,
      // passing arrays directly is fine, but pg needs empty arrays to have a typecast
      default: pgm.func("ARRAY[]::text[]"),
    },
    status: {
      type: "tweet_status",
      notNull: true,
      default: "draft",
    },
    posted_at: {
      type: "timestamp",
    },
    posted_tweet_id: {
      type: "text",
      notNull: true,
      default: "",
    },
    position: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  })

  pgm.createIndex("tweets", "post_id")
  pgm.createIndex("tweets", "feed_subscription_id")
}
