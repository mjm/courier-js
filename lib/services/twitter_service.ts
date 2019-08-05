import { UserId, Tweet } from "../data/types"
import UserService, { TwitterCredentials } from "./user_service"
import Twitter from "twitter"
import fetch from "node-fetch"
import Environment from "../env"
import { injectable } from "inversify"

/** A reference to a particular media item in the Twitter API. */
type MediaId = string

interface TweetResponse {
  id: string
  url: string
}

@injectable()
class TwitterService {
  constructor(private env: Environment, private userService: UserService) {}

  async tweet(userId: UserId, tweet: Tweet): Promise<TweetResponse> {
    const token = await this.userService.getTwitterCredentials(userId)
    const client = this.createClient(token)

    const postedTweet = await this.postTweet(client, tweet)

    return {
      id: postedTweet.id_str,
      url: `https://twitter.com/${postedTweet.user.screen_name}/status/${
        postedTweet.id_str
      }`,
    }
  }

  async postTweet(
    client: Twitter,
    tweet: Tweet
  ): Promise<Twitter.ResponseData> {
    if (tweet.action === "tweet") {
      const mediaIDs = await Promise.all(
        tweet.mediaURLs.map(url => this.uploadMedia(client, url))
      )

      return await client.post("statuses/update", {
        status: tweet.body,
        media_ids: mediaIDs.join(","),
      })
    } else if (tweet.action === "retweet") {
      return await client.post(`statuses/retweet/${tweet.retweetID}`, {})
    } else {
      throw new Error("Unrecognized tweet action")
    }
  }

  private createClient(token: TwitterCredentials): Twitter {
    return new Twitter({
      consumer_key: this.env.twitterConsumerKey,
      consumer_secret: this.env.twitterConsumerSecret,
      access_token_key: token.access_token,
      access_token_secret: token.access_token_secret,
    })
  }

  async uploadMedia(client: Twitter, url: string): Promise<MediaId> {
    const response = await fetch(url)
    const data = await response.buffer()
    const contentType = response.headers.get("content-type")
    if (!contentType) {
      throw new Error("Could not get content type from URL")
    }

    const mediaId = await this.initUpload(client, data, contentType)
    await this.uploadData(client, mediaId, data)
    await this.finalizeUpload(client, mediaId)
    return mediaId
  }

  async initUpload(
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

  async uploadData(
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

  async finalizeUpload(client: Twitter, mediaId: MediaId): Promise<void> {
    console.log("finalizing upload")
    console.log(
      await client.post("media/upload", {
        command: "FINALIZE",
        media_id: mediaId,
      })
    )
  }
}

export default TwitterService
