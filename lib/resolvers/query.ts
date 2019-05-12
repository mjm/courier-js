import { QueryResolvers } from "../generated/graphql"
import { allFeeds, getFeed } from "../data/feed"

export const Query: QueryResolvers = {
  async allFeeds(_parent, args, { getUser }) {
    await getUser()
    return await allFeeds(args)
  },

  async feed(_parent, { id }, { getUser }) {
    await getUser()
    return await getFeed(id)
  },

  async currentUser(_parent, _args, { getUser }) {
    return await getUser()
  },
}
