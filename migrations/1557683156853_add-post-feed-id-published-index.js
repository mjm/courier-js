exports.shorthands = undefined

exports.up = pgm => {
  pgm.createIndex("posts", ["feed_id", "published_at"])
}
