import { QueryResolvers } from "../generated/graphql"
import { allFeeds, getFeed } from "../data/feed"

export const Query: QueryResolvers = {
  async allFeeds() {
    return await allFeeds()
  },

  async feed(_parent, { id }) {
    return await getFeed(id)
  },
}
