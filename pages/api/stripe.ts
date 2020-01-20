import { CourierContext } from "lib/context"

const { billingEvents, evt } = CourierContext.create()

export default evt.httpHandler(
  async (req, res): Promise<void> => {
    const event = req.body
    await billingEvents.processEvent(event)
    res.json({ success: true })
  }
)

// TODO use webhook signing
// when we do, we'll need to disable the body parser
