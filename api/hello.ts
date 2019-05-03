import micro, { RequestHandler, json } from "../lib/micro"

const handler: RequestHandler = async (req, _res) => {
  const body = await json(req)
  return body
}

export default micro(handler)
