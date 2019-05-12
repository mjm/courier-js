import { FeedResolvers, FeedConnectionResolvers } from "../generated/graphql"

export const FeedConnection: FeedConnectionResolvers = {
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

export const Feed: FeedResolvers = {}
