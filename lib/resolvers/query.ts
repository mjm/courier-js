import { QueryResolvers } from "../generated/graphql"
import { allTweets } from "../data/tweet"
import { getUserInfo } from "../auth"

export const Query: QueryResolvers = {
  async currentUser(_parent, _args, { token }) {
    return await getUserInfo(token)
  },

  async allSubscribedFeeds(_parent, args, { feeds }) {
    return await feeds.paged(args)
  },

  async subscribedFeed(_parent, { id }, { loaders, getUser }) {
    await getUser()
    return await loaders.subscribedFeeds.load(id)
  },

  async allTweets(_parent, args, { getUser }) {
    const { sub } = await getUser()
    return await allTweets(sub, args)
  },
}
