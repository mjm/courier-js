exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable("feed_subscriptions", {
    id: "id",
    feed_id: {
      type: "bigint",
      notNull: true,
      references: '"feeds"',
      onDelete: "cascade",
    },
    user_id: {
      type: "text",
      notNull: true,
    },
    autopost: {
      type: "boolean",
      notNull: true,
      default: false,
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
    discarded_at: {
      type: "timestamp",
    },
  })

  pgm.createIndex("feed_subscriptions", "feed_id")
  pgm.createIndex("feed_subscriptions", ["feed_id", "user_id"], {
    unique: true,
  })
  pgm.createIndex("feed_subscriptions", "discarded_at")
}
