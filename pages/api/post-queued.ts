import { CourierContext } from "lib/context"

const { tweets, evt } = CourierContext.create()

export default evt.httpHandler(
  async (_req, res, evt): Promise<void> => {
    const results = await tweets.postQueued()
    evt.add({
      success_count: results.succeeded,
      failure_count: results.failed,
    })

    res.send(results)
  }
)
