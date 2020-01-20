import { locateFeed } from "feed-locator"
import { inject, injectable } from "inversify"
import { normalizeURL, scrapeFeed } from "scrape-feed"

import { EventContext } from "lib/events"

import { PagerEdge } from "../data/pager"
import {
  Feed,
  FeedId,
  FeedSubscriptionId,
  PagingOptions,
  PreviewFeed,
  SubscribedFeed,
  UserId,
} from "../data/types"
import * as keys from "../key"
import FeedRepository, { FeedLoader } from "../repositories/feed_repository"
import FeedSubscriptionRepository, {
  FeedSubscriptionPager,
  SubscribedFeedLoader,
} from "../repositories/feed_subscription_repository"
import EventService from "./event_service"
import ImportService from "./import_service"
import PublishService from "./publish_service"

@injectable()
class FeedService {
  constructor(
    private feeds: FeedRepository,
    private feedSubscriptions: FeedSubscriptionRepository,
    private feedLoader: FeedLoader,
    private subscribedFeedLoader: SubscribedFeedLoader,
    @inject(keys.UserId) private getUserId: () => Promise<UserId>,
    private importService: ImportService,
    private events: EventService,
    private publish: PublishService,
    private evt: EventContext
  ) {}

  async paged(options: PagingOptions = {}): Promise<FeedSubscriptionPager> {
    return this.feedSubscriptions.paged(await this.getUserId(), options)
  }

  async refreshAllByHomePageURL(url: string): Promise<void> {
    const homePageURL = normalizeURL(url)

    const feeds = await this.feeds.findAllByHomePageURL(homePageURL)
    await Promise.all(
      feeds.map(async feed => {
        await this.refresh(feed.id)
      })
    )
  }

  async refresh(id: FeedId, options: { force?: boolean } = {}): Promise<Feed> {
    const evt = this.evt.push("refresh_feed")
    evt.add({
      "feed.id": id,
      "feed.force_refresh": !!options.force,
    })

    const feed = await this.feedLoader.load(id)
    if (!feed) {
      throw new Error(`could not find feed with id ${id}`)
    }

    evt.add({
      "feed.url": feed.url,
      "feed.has_caching_headers": !!feed.cachingHeaders,
    })

    const currentHeaders = options.force ? {} : feed.cachingHeaders || {}
    const feedContents = await scrapeFeed(feed.url, currentHeaders)
    evt.add({ "feed.has_changes": !!feedContents })
    if (!feedContents) {
      this.evt.pop()

      // feed is already up-to-date
      return feed
    }

    const { title, homePageURL, cachingHeaders, entries } = feedContents

    // Import the posts from the feed first
    const result = await this.importService.importPosts(id, entries)
    console.log(result)

    const micropubEndpoint = (await this.getMicropubEndpoint(homePageURL)) || ""

    // Only after importing posts should we update feed details. Otherwise, the
    // caching headers will stop us from getting any missed posts again until the
    // feed is updated again.
    const updatedFeed = await this.feeds.update(id, {
      title,
      homePageURL,
      cachingHeaders,
      micropubEndpoint,
    })
    this.feedLoader.replace(id, updatedFeed)

    await this.events.record("feed_refresh", { feedId: id })

    return updatedFeed
  }

  async preview(url: string): Promise<PreviewFeed> {
    const feedURL = await locateFeed(url)

    const feedContents = await scrapeFeed(feedURL)
    if (!feedContents) {
      throw new Error("Couldn't load feed contents")
    }

    const { title, homePageURL, entries } = feedContents
    const tweets = this.importService.generatePreviewTweets(entries)

    return {
      url: feedURL,
      title,
      homePageURL,
      tweets,
    }
  }

  async subscribe(url: string): Promise<PagerEdge<SubscribedFeed>> {
    const feedURL = await locateFeed(url)

    let feed = await this.feeds.findByURL(feedURL)
    if (!feed) {
      feed = await this.feeds.create(feedURL)
      this.feedLoader.prime(feed.id, feed)

      feed = await this.refresh(feed.id)
    }

    this.feedLoader.prime(feed.id, feed)

    const subscribedFeed = await this.feedSubscriptions.create(
      await this.getUserId(),
      feed.id
    )

    this.subscribedFeedLoader.prime(subscribedFeed.id, subscribedFeed)

    this.events.record("feed_subscribe", {
      feedId: feed.id,
      feedSubscriptionId: subscribedFeed.id,
    })

    // create tweets for recent posts in the feed.
    // the posts should already exist, but since tweets are per-subscription, we need
    // to create those when we subscribe
    await this.importService.importRecentPosts(subscribedFeed.id)

    return await this.feedSubscriptions.getEdge(subscribedFeed.id)
  }

  async unsubscribe(id: FeedSubscriptionId): Promise<void> {
    await this.feedSubscriptions.delete(await this.getUserId(), id)
    await this.events.record("feed_unsubscribe", { feedSubscriptionId: id })
  }

  async updateOptions(
    id: FeedSubscriptionId,
    options: {
      autopost?: boolean | null
    }
  ): Promise<SubscribedFeed> {
    const feed = await this.feedSubscriptions.update(
      await this.getUserId(),
      id,
      options
    )

    this.subscribedFeedLoader.replace(feed.id, feed)

    if (options.autopost !== undefined && options.autopost !== null) {
      await this.events.record("feed_set_autopost", {
        feedSubscriptionId: feed.id,
        value: options.autopost,
      })
    }

    return feed
  }

  private async getMicropubEndpoint(url: string): Promise<string | null> {
    const result = await this.publish.getMicroformats(url)

    if (result.rels.micropub && result.rels.micropub.length) {
      return result.rels.micropub[0]
    }

    return null
  }
}

export default FeedService
