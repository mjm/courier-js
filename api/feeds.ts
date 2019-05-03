import micro, { createError, json, RequestHandler } from "../lib/micro"
import { allFeeds, createFeed } from "../lib/data/feed"
import { FeedInput } from "../lib/data/types"

const handler: RequestHandler = async (req, _res) => {
  switch (req.method) {
    case "GET":
      const result = await allFeeds()
      return result

    case "POST":
      const input = await json(req)
      const feed = await createFeed(input as FeedInput)
      return feed

    default:
      throw createError(400, `invalid method ${req.method}`)
  }
}

export default micro(handler)
