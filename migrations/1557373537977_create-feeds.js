exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable("feeds", {
    id: "id",
    url: { type: "text", notNull: true },
    title: { type: "text", notNull: true, default: "" },
    home_page_url: { type: "text", notNull: true, default: "" },
    refreshed_at: { type: "timestamp" },
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
    caching_headers: { type: "jsonb" },
  })

  // no duplicate feed URLs allowed
  pgm.createIndex("feeds", "url", { unique: true })
}
