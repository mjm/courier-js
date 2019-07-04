import micro, { RequestHandler, send } from "../lib/micro"
import { createContext } from "../lib/context"

const context = createContext()

const handler: RequestHandler = async (_req, res) => {
  const { tweets } = await context
  const results = await tweets.postQueued()

  console.log(results)
  send(res, 200, results)
}

export default micro(handler)
