import db, { sql } from "../db"
import { FeedId, SubscribedFeed, FeedSubscriptionId } from "./types"
import { getRecentPosts } from "./post"
import { importTweets } from "./tweet"
import * as table from "./dbTypes"
import FeedSubscriptionRepository from "../repositories/feed_subscription_repository"

export async function getFeedSubscriptions(
  id: FeedId
): Promise<SubscribedFeed[]> {
  const rows = await db.any(sql<table.feed_subscriptions>`
    SELECT *
      FROM feed_subscriptions
     WHERE feed_id = ${id}
  `)

  return rows.map(FeedSubscriptionRepository.fromRow)
}

export async function getFeedSubscription(
  id: FeedSubscriptionId
): Promise<SubscribedFeed> {
  const row = await db.one(sql<table.feed_subscriptions>`
    SELECT *
      FROM feed_subscriptions
     WHERE id = ${id}
  `)

  return FeedSubscriptionRepository.fromRow(row)
}

async function importRecentPosts(feed: SubscribedFeed): Promise<void> {
  // translating every post for the new subscription could be an excessive amount of work
  const posts = await getRecentPosts(feed.feedId)

  await Promise.all(
    posts.map(async post => {
      await importTweets({
        feedSubscriptionId: feed.id,
        post,
      })
    })
  )
}
