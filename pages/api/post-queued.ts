import { NextApiRequest, NextApiResponse } from "next"

import { CourierContext } from "lib/context"

const { tweets } = CourierContext.create()

export default async (
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const results = await tweets.postQueued()

  console.log(results)
  res.send(results)
}
