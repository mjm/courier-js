import {
  EventResolvers,
  EventType as EventTypeGQL,
  EnumMap,
} from "../generated/graphql"
import { EventType as EventTypeRepo } from "../data/types"

export const EventType: EnumMap<EventTypeGQL, EventTypeRepo> = {
  FEED_REFRESH: "feed_refresh",
  FEED_SET_AUTOPOST: "feed_set_autopost",
  FEED_SUBSCRIBE: "feed_subscribe",
  FEED_UNSUBSCRIBE: "feed_unsubscribe",
  TWEET_CANCEL: "tweet_cancel",
  TWEET_UNCANCEL: "tweet_uncancel",
  TWEET_EDIT: "tweet_edit",
  TWEET_POST: "tweet_post",
  TWEET_AUTOPOST: "tweet_autopost",
  SUBSCRIPTION_CREATE: "subscription_create",
  SUBSCRIPTION_RENEW: "subscription_renew",
  SUBSCRIPTION_CANCEL: "subscription_cancel",
  SUBSCRIPTION_REACTIVATE: "subscription_reactivate",
  SUBSCRIPTION_EXPIRE: "subscription_expire",
}

export const Event: EventResolvers = {
  async feed(event, {}, { loaders }) {
    const params = event.parameters as any
    if (params.feedId) {
      return await loaders.feeds.load(params.feedId)
    } else if (params.feedSubscriptionId) {
      const subscribedFeed = await loaders.subscribedFeeds.load(
        params.feedSubscriptionId
      )
      if (subscribedFeed) {
        return await loaders.feeds.load(subscribedFeed.feedId)
      }
    }

    return null
  },

  async tweet(event, {}, { loaders }) {
    const params = event.parameters as any
    if (params.tweetId) {
      return await loaders.tweets.load(params.tweetId)
    }

    return null
  },

  boolValue(event) {
    const params = event.parameters as any
    if (event.eventType === "feed_set_autopost") {
      return params.value
    }

    return null
  },
}
