exports.shorthands = undefined

exports.up = pgm => {
  pgm.addColumns("tweets", {
    post_after: { type: "timestamp" },
  })

  pgm.createIndex("tweets", "post_after")
}
