import { IdPrefix,toExternalId } from "lib/data/id"

import {
  Post,
  SubscribedFeed,
  TweetAction as TweetActionRepo,
  TweetStatus as TweetStatusRepo,
} from "../data/types"
import {
  EnumMap,
  TweetAction as TweetActionGQL,
  TweetResolvers,
  TweetStatus as TweetStatusGQL,
} from "../generated/graphql"

export const TweetAction: EnumMap<TweetActionGQL, TweetActionRepo> = {
  TWEET: "tweet",
  RETWEET: "retweet",
}

export const TweetStatus: EnumMap<TweetStatusGQL, TweetStatusRepo> = {
  DRAFT: "draft",
  CANCELED: "canceled",
  POSTED: "posted",
}

export const Tweet: TweetResolvers = {
  id({ id }) {
    return toExternalId(IdPrefix.Tweet, id)
  },

  async post({ postId }, _, { loaders }) {
    return (await loaders.posts.load(postId)) as Post
  },

  async feed({ feedSubscriptionId }, _, { loaders }) {
    return (await loaders.subscribedFeeds.load(
      feedSubscriptionId
    )) as SubscribedFeed
  },
}
