exports.up = pgm => {
  pgm.createTable("device_tokens", {
    id: "id",
    user_id: {
      type: "text",
      notNull: true,
    },
    token: {
      type: "text",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  })

  pgm.createIndex("device_tokens", "user_id")
  pgm.createIndex("device_tokens", ["user_id", "token"], { unique: true })
}
