import { NextApiRequest, NextApiResponse } from "next"

import { CourierContext } from "lib/context"

const { tweets, evt: events } = CourierContext.create()

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const evt = events.push("http_request")
  evt.add({
    "http.method": req.method,
    "http.url": req.url,
  })

  try {
    const results = await tweets.postQueued()

    console.log(results)
    res.send(results)
  } catch (err) {
    evt.add({ err: err.message })
  } finally {
    evt.add({
      "http.status": res.statusCode,
    })
    events.pop()
    await events.flush()
  }
}
