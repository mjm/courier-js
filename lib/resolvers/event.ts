import {
  EventResolvers,
  EventType as EventTypeGQL,
  EnumMap,
} from "../generated/graphql"
import { EventType as EventTypeRepo } from "../data/types"
import { toExternalId, IdPrefix } from "lib/data/id"

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
  id({ id }) {
    return toExternalId(IdPrefix.Event, id)
  },

  async feed(event, _, { loaders }) {
    const params = event.parameters
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

  async tweet(event, _, { loaders }) {
    const params = event.parameters
    if (params.tweetId) {
      return await loaders.tweets.load(params.tweetId)
    }

    return null
  },

  boolValue(event) {
    const params = event.parameters
    if (event.eventType === "feed_set_autopost") {
      return params.value as boolean
    }

    return null
  },
}
