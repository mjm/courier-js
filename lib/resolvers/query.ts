import { QueryResolvers } from "../generated/graphql"
import { allFeeds, getFeed, allFeedsForUser } from "../data/feed"

export const Query: QueryResolvers = {
  async allSubscribedFeeds(_parent, args, { getUser }) {
    const { sub } = await getUser()
    return await allFeedsForUser(sub, args)
  },

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
