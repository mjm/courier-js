import { PostConnectionResolvers, PostResolvers } from "../generated/graphql"
import { getFeed } from "../data/feed"

export const PostConnection: PostConnectionResolvers = {
  async edges(pager) {
    return await pager.getEdges()
  },

  async nodes(pager) {
    return await pager.getNodes()
  },

  async totalCount(pager) {
    return await pager.getTotalCount()
  },

  async pageInfo(pager) {
    return await pager.getPageInfo()
  },
}

export const Post: PostResolvers = {
  async feed(post) {
    return await getFeed(post.feedId)
  },
}
