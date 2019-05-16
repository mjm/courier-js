import Twitter from "twitter"
import { UserId, Tweet } from "./data/types"
import { getTwitterCredentials } from "./auth"

interface TwitterPostInput {
  userId: UserId
  tweet: Tweet
}

export async function postToTwitter({
  userId,
  tweet,
}: TwitterPostInput): Promise<string> {
  const { access_token, access_token_secret } = await getTwitterCredentials(
    userId
  )

  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY!,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
    access_token_key: access_token,
    access_token_secret,
  })

  // TODO upload any media first
  if (tweet.mediaURLs.length) {
    throw new Error("Media uploading is not yet supported.")
  }

  const postedTweet = await client.post("statuses/update", {
    status: tweet.body,
  })

  return postedTweet.id_str
}
