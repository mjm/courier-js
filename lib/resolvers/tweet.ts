import {
  EnumMap,
  TweetResolvers,
  TweetStatus as TweetStatusGQL,
} from "../generated/graphql"
import { TweetStatus as TweetStatusRepo } from "../data/types"

export const TweetStatus: EnumMap<TweetStatusGQL, TweetStatusRepo> = {
  DRAFT: "draft",
  CANCELED: "canceled",
  POSTED: "posted",
}

export const Tweet: TweetResolvers = {
  async post({ postId }, {}, { loaders }) {
    return (await loaders.posts.load(postId))!
  },

  async feed({ feedSubscriptionId }, {}, { loaders }) {
    return (await loaders.subscribedFeeds.load(feedSubscriptionId))!
  },
}
