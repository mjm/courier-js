import { QueryResolvers } from "../generated/graphql"
import { allFeeds, getFeed, allFeedsForUser } from "../data/feed"
import { allTweets } from "../data/tweet"
import { getUserInfo } from "../auth"

export const Query: QueryResolvers = {
  async allSubscribedFeeds(_parent, args, { getUser }) {
    const { sub } = await getUser()
    return await allFeedsForUser(sub, args)
  },

  async allTweets(_parent, args, { getUser }) {
    const { sub } = await getUser()
    return await allTweets(sub, args)
  },

  async allFeeds(_parent, args, { getUser }) {
    await getUser()
    return await allFeeds(args)
  },

  async feed(_parent, { id }, { getUser }) {
    await getUser()
    return await getFeed(id)
  },

  async currentUser(_parent, _args, { token }) {
    return await getUserInfo(token)
  },
}
