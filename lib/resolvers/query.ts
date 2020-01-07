import { QueryResolvers } from "../generated/graphql"

export const Query: QueryResolvers = {
  async currentUser(_parent, _args, { user }) {
    return await user.getUserInfo()
  },

  async viewer(_parent, _args, { user }) {
    return await user.getUserInfo()
  },

  async allSubscribedFeeds(_parent, args, { feeds }) {
    return await feeds.paged(args)
  },

  async subscribedFeed(_parent, { id }, { loaders, user }) {
    await user.verify()
    return await loaders.subscribedFeeds.load(id)
  },

  async allTweets(_parent, args, { tweets }) {
    return await tweets.paged(args)
  },

  async tweet(_parent, { id }, { loaders, user }) {
    await user.verify()
    return await loaders.tweets.load(id)
  },

  async allEvents(_parent, args, { events }) {
    return await events.paged(args)
  },

  async microformats(_parent, { url }, { publish }) {
    return await publish.getMicroformats(url)
  },

  async feedPreview(_parent, { url }, { feeds }) {
    return await feeds.preview(url)
  },
}
