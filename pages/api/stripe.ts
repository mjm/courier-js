import { NextApiRequest, NextApiResponse } from "next"
import { CourierContext } from "lib/context"

const { billingEvents } = CourierContext.create()

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const event = req.body
  await billingEvents.processEvent(event)
  res.json({ success: true })
}

// TODO use webhook signing
// when we do, we'll need to disable the body parser
