import micro, { RequestHandler, send } from "../../lib/micro"
import { CourierContext } from "../../lib/context"

const { tweets } = CourierContext.create()

const handler: RequestHandler = async (_req, res) => {
  const results = await tweets.postQueued()

  console.log(results)
  send(res, 200, results)
}

export default micro(handler)
