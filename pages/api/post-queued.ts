import { CourierContext } from "lib/context"
import { NextApiRequest, NextApiResponse } from "next"

const { tweets } = CourierContext.create()

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const results = await tweets.postQueued()

  console.log(results)
  res.send(results)
}
