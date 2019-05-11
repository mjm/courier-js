exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable("posts", {
    id: "id",
    feed_id: {
      type: "bigint",
      notNull: true,
      references: '"feeds"',
      onDelete: "cascade",
    },
    item_id: { type: "text", notNull: true },
    text_content: { type: "text", notNull: true, default: "" },
    html_content: { type: "text", notNull: true, default: "" },
    title: { type: "text", notNull: true, default: "" },
    url: { type: "text", notNull: true, default: "" },
    published_at: { type: "timestamp" },
    modified_at: { type: "timestamp" },
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

  // item ID should be unique within a feed
  pgm.createIndex("posts", ["feed_id", "item_id"], { unique: true })

  pgm.createIndex("posts", "feed_id")
}
