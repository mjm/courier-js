exports.up = pgm => {
  pgm.addColumns("feeds", {
    mp_endpoint: { type: "text", notNull: true, default: "" },
  })
}
