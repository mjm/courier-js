import FeedRepository, { FeedLoader } from "../repositories/feed_repository"
import FeedSubscriptionRepository, {
  SubscribedFeedLoader,
} from "../repositories/feed_subscription_repository"
import {
  UserId,
  SubscribedFeed,
  PagingOptions,
  FeedId,
  Feed,
  FeedSubscriptionId,
} from "../data/types"
import { Pager } from "../data/pager"
import { AuthenticationError } from "apollo-server-core"
import { scrapeFeed, normalizeURL } from "scrape-feed"
import { locateFeed } from "feed-locator"
import ImportService from "./import_service"

class FeedService {
  constructor(
    private userId: UserId | null,
    private feeds: FeedRepository,
    private feedSubscriptions: FeedSubscriptionRepository,
    private feedLoader: FeedLoader,
    private subscribedFeedLoader: SubscribedFeedLoader,
    private importService: ImportService
  ) {}

  paged(options: PagingOptions = {}): Pager<SubscribedFeed, any> {
    return this.feedSubscriptions.paged(this.assertUserId(), options)
  }

  async refreshAllByHomePageURL(url: string) {
    const homePageURL = normalizeURL(url)

    const feeds = await this.feeds.findAllByHomePageURL(homePageURL)
    await Promise.all(
      feeds.map(async feed => {
        await this.refresh(feed.id)
      })
    )
  }

  async refresh(id: FeedId, options: { force?: boolean } = {}): Promise<Feed> {
    const feed = await this.feedLoader.load(id)
    if (!feed) {
      throw new Error(`could not find feed with id ${id}`)
    }

    const currentHeaders = options.force ? {} : feed.cachingHeaders || {}
    const feedContents = await scrapeFeed(feed.url, currentHeaders)
    if (!feedContents) {
      // feed is already up-to-date
      return feed
    }

    const { title, homePageURL, cachingHeaders, entries } = feedContents

    // Import the posts from the feed first
    const result = await this.importService.importPosts(id, entries)
    console.log(result)

    // Only after importing posts should we update feed details. Otherwise, the
    // caching headers will stop us from getting any missed posts again until the
    // feed is updated again.
    const updatedFeed = await this.feeds.update(id, {
      title,
      homePageURL,
      cachingHeaders,
    })
    this.feedLoader.clear(id).prime(id, updatedFeed)

    return updatedFeed
  }

  async subscribe(url: string): Promise<SubscribedFeed> {
    const feedURL = await locateFeed(url)

    let feed = await this.feeds.findByURL(feedURL)
    if (!feed) {
      feed = await this.feeds.create(feedURL)
      this.feedLoader.prime(feed.id, feed)

      feed = await this.refresh(feed.id)
    }

    this.feedLoader.prime(feed.id, feed)

    const subscribedFeed = await this.feedSubscriptions.create(
      this.assertUserId(),
      feed.id
    )

    this.subscribedFeedLoader.prime(subscribedFeed.id, subscribedFeed)

    // create tweets for recent posts in the feed.
    // the posts should already exist, but since tweets are per-subscription, we need
    // to create those when we subscribe
    await this.importService.importRecentPosts(subscribedFeed.id)

    return subscribedFeed
  }

  async unsubscribe(id: FeedSubscriptionId): Promise<void> {
    await this.feedSubscriptions.delete(this.assertUserId(), id)
  }

  async updateOptions(
    id: FeedSubscriptionId,
    options: {
      autopost?: boolean | null
    }
  ): Promise<SubscribedFeed> {
    const feed = await this.feedSubscriptions.update(
      this.assertUserId(),
      id,
      options
    )

    this.subscribedFeedLoader.clear(feed.id).prime(feed.id, feed)

    return feed
  }

  private assertUserId(): UserId {
    if (!this.userId) {
      throw new AuthenticationError(
        "a user must be logged in to perform this action"
      )
    }

    return this.userId
  }
}

export default FeedService
