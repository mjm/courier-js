exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable("events", {
    id: "id",
    user_id: "text",
    event_type: {
      type: "text",
      notNull: true,
    },
    parameters: {
      type: "jsonb",
      notNull: true,
      default: "{}",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  })

  pgm.createIndex("events", "created_at")
  pgm.createIndex("events", ["user_id", "created_at"])
}
