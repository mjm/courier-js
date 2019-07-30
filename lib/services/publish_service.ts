import { injectable } from "inversify"
import Environment from "../env"
import { PostId } from "../data/types"
import { PostLoader } from "../repositories/post_repository"
import { Micropub } from "micropub-client"
import { FeedLoader } from "../repositories/feed_repository"

@injectable()
class PublishService {
  constructor(
    private env: Environment,
    private postLoader: PostLoader,
    private feedLoader: FeedLoader
  ) {}

  async addTweetToPost(postId: PostId, tweetUrl: string): Promise<void> {
    const post = await this.postLoader.load(postId)
    if (!post) {
      throw new Error("Could not find post to update.")
    }

    const feed = await this.feedLoader.load(post.feedId)
    if (!feed) {
      throw new Error("Could not find feed for post.")
    }

    const url = feed.micropubEndpoint
    if (!url) {
      // it's fine if the feed doesn't have a micropub endpoint.
      // in that case, just skip this part
      return
    }

    const micropub = new Micropub({
      url,
      // TODO get this from stored user data
      token: this.env.micropubToken,
    })

    console.log(`Adding syndication link to ${post.url}`)
    await micropub.update({
      url: post.url,
      add: {
        syndication: [tweetUrl],
      },
    })
  }
}

export default PublishService
