import { PostResolvers } from "../generated/graphql"
import { getFeed } from "../data/feed"

export const Post: PostResolvers = {
  async feed(post) {
    return await getFeed(post.feedId)
  },
}
