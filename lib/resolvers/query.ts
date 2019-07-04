import { QueryResolvers } from "../generated/graphql"

export const Query: QueryResolvers = {
  async currentUser(_parent, _args, { user }) {
    return await user.getUserInfo()
  },

  async allSubscribedFeeds(_parent, args, { feeds }) {
    return await feeds.paged(args)
  },

  async subscribedFeed(_parent, { id }, { loaders, getUser }) {
    await getUser()
    return await loaders.subscribedFeeds.load(id)
  },

  async allTweets(_parent, args, { tweets }) {
    return await tweets.paged(args)
  },
}
