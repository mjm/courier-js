import Twitter from "twitter"
import { UserId, Tweet } from "./data/types"
import { getTwitterCredentials, TwitterCredentials } from "./auth"
import fetch from "node-fetch"

interface TwitterPostInput {
  userId: UserId
  tweet: Tweet
}

export async function postToTwitter({
  userId,
  tweet,
}: TwitterPostInput): Promise<string> {
  const token = await getTwitterCredentials(userId)
  const client = createClient(token)

  const mediaIDs = await Promise.all(
    tweet.mediaURLs.map(url => uploadMedia(client, url))
  )

  const postedTweet = await client.post("statuses/update", {
    status: tweet.body,
    media_ids: mediaIDs.join(","),
  })

  return postedTweet.id_str
}

function createClient({
  access_token,
  access_token_secret,
}: TwitterCredentials): Twitter {
  return new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY!,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
    access_token_key: access_token,
    access_token_secret,
  })
}

/** A reference to a particular media item in the Twitter API. */
type MediaId = string

async function uploadMedia(client: Twitter, url: string): Promise<MediaId> {
  const response = await fetch(url)
  const data = await response.buffer()
  const contentType = response.headers.get("content-type")
  if (!contentType) {
    throw new Error("Could not get content type from URL")
  }

  const mediaId = await initUpload(client, data, contentType)
  await uploadData(client, mediaId, data)
  await finalizeUpload(client, mediaId)
  return mediaId
}

async function initUpload(
  client: Twitter,
  buffer: Buffer,
  contentType: string
): Promise<MediaId> {
  console.log("initializing upload")
  const { media_id_string } = await client.post("media/upload", {
    command: "INIT",
    total_bytes: Buffer.byteLength(buffer),
    media_type: contentType,
  })

  return media_id_string
}

async function uploadData(
  client: Twitter,
  mediaId: MediaId,
  buffer: Buffer
): Promise<void> {
  const length = Buffer.byteLength(buffer)
  const chunkSize = 1024 * 1024

  for (
    let startIndex = 0, i = 0;
    startIndex < length;
    startIndex += chunkSize, i += 1
  ) {
    const chunk = buffer.slice(startIndex, startIndex + chunkSize)
    console.log("uploading chunk", i)
    console.log(
      await client.post("media/upload", {
        command: "APPEND",
        media_id: mediaId,
        media: chunk,
        segment_index: i,
      })
    )
  }
}

async function finalizeUpload(
  client: Twitter,
  mediaId: MediaId
): Promise<void> {
  console.log("finalizing upload")
  console.log(
    await client.post("media/upload", {
      command: "FINALIZE",
      media_id: mediaId,
    })
  )
}
