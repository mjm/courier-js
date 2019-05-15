import DataLoader from "dataloader"
import {
  FeedId,
  Feed,
  UserId,
  FeedSubscriptionId,
  SubscribedFeed,
} from "../data/types"
import { getFeedsById, getSubscriptionsById } from "../data/feed"

export function feedLoader(): DataLoader<FeedId, Feed | null> {
  return new DataLoader(async ids => {
    return await getFeedsById(ids)
  })
}

export function subscribedFeedLoader(
  userId: UserId | null
): DataLoader<FeedSubscriptionId, SubscribedFeed | null> {
  if (!userId) {
    // if no user is logged in, we won't find any subscriptions, so just
    // return null without hitting the DB
    return new DataLoader(async ids => Array(ids.length).fill(null))
  }

  return new DataLoader(async ids => {
    return await getSubscriptionsById(userId, ids)
  })
}
