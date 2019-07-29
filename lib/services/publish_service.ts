import { injectable } from "inversify"
import Environment from "../env"
import { PostId } from "../data/types"
import { PostLoader } from "../repositories/post_repository"
import { Micropub } from "micropub-client"

@injectable()
class PublishService {
  constructor(private env: Environment, private postLoader: PostLoader) {}

  async addTweetToPost(postId: PostId, tweetUrl: string): Promise<void> {
    const post = await this.postLoader.load(postId)
    if (!post) {
      throw new Error("Could not find post to update.")
    }

    // TODO construct this from stored user data
    const micropub = new Micropub({
      url: this.env.micropubUrl,
      token: this.env.micropubToken,
    })

    await micropub.update({
      url: post.url,
      add: {
        syndication: [tweetUrl],
      },
    })
  }
}

export default PublishService
