import { injectable } from "inversify"
import { PostId, UserId } from "../data/types"
import { PostLoader } from "../repositories/post_repository"
import { Micropub } from "micropub-client"
import { FeedLoader } from "../repositories/feed_repository"
import UserService from "./user_service"
import Microformats, { MicroformatDocument } from "microformat-node"
import fetch from "isomorphic-unfetch"

@injectable()
class PublishService {
  constructor(
    private userService: UserService,
    private postLoader: PostLoader,
    private feedLoader: FeedLoader
  ) {}

  async addTweetToPost(
    userId: UserId,
    postId: PostId,
    tweetUrl: string
  ): Promise<void> {
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

    const token = await this.userService.getMicropubToken(
      userId,
      feed.homePageURL
    )
    if (!token) {
      // this user hasn't logged in to the site
      return
    }

    const micropub = new Micropub({ url, token })

    console.log(`Adding syndication link to ${post.url}`)
    await micropub.update({
      url: post.url,
      add: {
        syndication: [tweetUrl],
      },
    })
  }

  async getMicroformats(url: string): Promise<MicroformatDocument> {
    const resp = await fetch(url)
    const html = await resp.text()

    return await Microformats.getAsync({
      html,
      baseUrl: url,
      textFormat: "normalised",
    })
  }
}

export default PublishService
