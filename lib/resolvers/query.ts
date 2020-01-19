import { fromExternalId, IdPrefix } from "lib/data/id"

import { QueryResolvers } from "../generated/graphql"

export const Query: QueryResolvers = {
  async currentUser(_parent, _args, { user }) {
    return await user.getUserInfo()
  },

  async viewer(_parent, _args, { user }) {
    return await user.getUserInfo()
  },

  async node(_parent, { id }, { loaders, user }) {
    await user.verify()

    const [prefix, theId] = fromExternalId(id)
    switch (prefix) {
      case IdPrefix.Tweet:
        return await loaders.tweets.load(theId)
      case IdPrefix.Post:
        return await loaders.posts.load(theId)
      case IdPrefix.Feed:
        return await loaders.feeds.load(theId)
      case IdPrefix.FeedSubscription:
        return await loaders.subscribedFeeds.load(theId)
      case IdPrefix.Event:
        return await loaders.events.load(theId)
      case IdPrefix.DeviceToken:
        return await loaders.deviceTokens.load(theId)
    }
  },

  async allSubscribedFeeds(_parent, args, { feeds }) {
    return await feeds.paged(args)
  },

  async subscribedFeed(_parent, { id }, { loaders, user }) {
    await user.verify()
    return await loaders.subscribedFeeds.load(
      fromExternalId(id, IdPrefix.FeedSubscription)
    )
  },

  async allTweets(_parent, args, { tweets }) {
    return await tweets.paged(args)
  },

  async tweet(_parent, { id }, { loaders, user }) {
    await user.verify()
    return await loaders.tweets.load(fromExternalId(id, IdPrefix.Tweet))
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
