import { NextApiRequest, NextApiResponse } from "next"

import { CourierContext } from "lib/context"
import { completeIndieAuth } from "utils/indieauth"

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { user, evt } = CourierContext.createForRequest(req)
  return await evt.handleHttp(req, res, async _evt => {
    const { origin, url, token } = await completeIndieAuth(req)
    await user.setMicropubToken(null, url, token)
    res.writeHead(301, { Location: origin })
    res.end()
  })
}
