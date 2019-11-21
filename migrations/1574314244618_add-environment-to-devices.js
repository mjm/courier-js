exports.up = pgm => {
  pgm.addColumns("device_tokens", {
    environment: {
      type: "text",
      notNull: true,
      default: "SANDBOX",
    },
  })
}
