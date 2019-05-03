import micro, { RequestHandler } from "../../lib/micro"
import query from "micro-query"
import { getFeed } from "../../lib/data/feed"

const handler: RequestHandler = async (req, _res) => {
  const { id } = query(req)
  const feed = await getFeed(id)

  // TODO actually go fetch the feed and do stuff with it

  return feed
}

export default micro(handler)
