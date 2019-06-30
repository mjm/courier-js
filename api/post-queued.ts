import micro, { RequestHandler, send } from "../lib/micro"
import { getTweetsToPost, postQueuedTweet } from "../lib/data/tweet"

const handler: RequestHandler = async (_req, res) => {
  const tweets = await getTweetsToPost()

  const results = { succeeded: 0, failed: 0 }
  for (const tweet of tweets) {
    try {
      await postQueuedTweet(tweet)
      results.succeeded++
    } catch (e) {
      // log the error but don't fail the request, or we'll fail other tweets
      console.error("Error posting queued tweet:", e)
      results.failed++
    }
  }

  console.log(results)
  send(res, 200, results)
}

export default micro(handler)
