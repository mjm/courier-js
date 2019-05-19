import { QueryResolvers } from "../generated/graphql"
import { allFeedsForUser } from "../data/feed"
import { allTweets } from "../data/tweet"
import { getUserInfo } from "../auth"

export const Query: QueryResolvers = {
  async currentUser(_parent, _args, { token }) {
    return await getUserInfo(token)
  },

  async allSubscribedFeeds(_parent, args, { getUser }) {
    const { sub } = await getUser()
    return await allFeedsForUser(sub, args)
  },

  async allTweets(_parent, args, { getUser }) {
    const { sub } = await getUser()
    return await allTweets(sub, args)
  },
}
