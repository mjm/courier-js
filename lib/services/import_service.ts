import {
  FeedId,
  PostImportResult,
  UpdatePostInput,
  Post,
  NewPostInput,
  PostId,
  FeedSubscriptionId,
  SubscribedFeed,
} from "../data/types"
import { ScrapedEntry } from "scrape-feed"
import { countBy, zip } from "lodash"
import PostRepository, { PostLoader } from "../repositories/post_repository"
import { isSameDate } from "../data/util"
import FeedSubscriptionRepository, {
  SubscribedFeedLoader,
} from "../repositories/feed_subscription_repository"
import { translate } from "html-to-tweets"
import TweetRepository, { TweetLoader } from "../repositories/tweet_repository"

class ImportService {
  constructor(
    private feedSubscriptions: FeedSubscriptionRepository,
    private posts: PostRepository,
    private tweets: TweetRepository,
    private subscribedFeedLoader: SubscribedFeedLoader,
    private postLoader: PostLoader,
    private tweetLoader: TweetLoader
  ) {}

  async importPosts(
    feedId: FeedId,
    entries: ScrapedEntry[]
  ): Promise<PostImportResult> {
    const importPromises = entries.map(entry => this.importPost(feedId, entry))
    const imports = await Promise.all(importPromises)

    // Ensure that we have zeros for any types that aren't used
    const defaultResult = { created: 0, updated: 0, unchanged: 0 }
    return { ...defaultResult, ...countBy(imports) }
  }

  async importRecentPosts(
    feedSubscriptionId: FeedSubscriptionId
  ): Promise<void> {
    const feed = (await this.subscribedFeedLoader.load(feedSubscriptionId))!

    // translating every post for the new subscription could be an excessive amount of work,
    // and probably isn't what someone expects anyway, so we just grab the last few.
    const recentPosts = await this.posts
      .pagedByFeed(feed.feedId, { last: 10 })
      .nodes()

    await Promise.all(
      recentPosts.map(async post => {
        await this.createSubscriptionTweets(feed, post)
      })
    )
  }

  private async importPost(
    feedId: FeedId,
    entry: ScrapedEntry
  ): Promise<keyof PostImportResult> {
    const existingPost = await this.posts.findByItemID(feedId, entry.id)
    if (existingPost) {
      const input: UpdatePostInput = {
        title: entry.title,
        url: entry.url,
        textContent: entry.textContent,
        htmlContent: entry.htmlContent,
        publishedAt: entry.publishedAt,
        modifiedAt: entry.modifiedAt,
      }

      if (!this.hasChanges(input, existingPost)) {
        return "unchanged"
      }

      await this.updatePost(existingPost.id, input)
      return "updated"
    } else {
      const input: NewPostInput = {
        feedId,
        itemId: entry.id,
        title: entry.title,
        url: entry.url,
        textContent: entry.textContent,
        htmlContent: entry.htmlContent,
        publishedAt: entry.publishedAt,
        modifiedAt: entry.modifiedAt,
      }

      await this.createPost(input)
      return "created"
    }
  }

  private async updatePost(id: PostId, input: UpdatePostInput): Promise<void> {
    const post = await this.posts.update(id, input)
    this.postLoader.clear(id).prime(id, post)

    await this.createTweets(post)
  }

  private async createPost(input: NewPostInput): Promise<void> {
    const post = await this.posts.create(input)
    this.postLoader.prime(post.id, post)

    await this.createTweets(post)
  }

  private async createTweets(post: Post): Promise<void> {
    const subscriptions = await this.feedSubscriptions.findAllByFeed(
      post.feedId
    )

    await Promise.all(
      subscriptions.map(async sub => {
        return await this.createSubscriptionTweets(sub, post)
      })
    )
  }

  private async createSubscriptionTweets(
    feedSubscription: SubscribedFeed,
    post: Post
  ): Promise<void> {
    // Generate the expected tweets
    const tweets = translate({
      url: post.url,
      title: post.title,
      html: post.htmlContent,
    })

    // Get the existing tweets for this post/subscription combo
    const existingTweets = await this.tweets.findAllByPost(
      feedSubscription.id,
      post.id
    )

    // Either create or update as needed
    const zippedTweets = zip(tweets, existingTweets).map(
      ([nt, et], i) => [i, nt, et] as const
    )
    for (let [i, tweet, existingTweet] of zippedTweets) {
      if (!existingTweet && tweet) {
        // we need to make a new tweet here
        const newTweet = await this.tweets.create({
          feedSubscriptionId: feedSubscription.id,
          postId: post.id,
          body: tweet.body,
          mediaURLs: tweet.mediaURLs,
          position: i,
          autopost: feedSubscription.autopost,
        })
        this.tweetLoader.prime(newTweet.id, newTweet)
      } else if (!tweet && existingTweet) {
        // we need to delete the tweet that already exists?
        // I'm not actually sure what to do here.
      } else if (tweet && existingTweet) {
        // we need to update the existing tweet if it hasn't been posted yet
        if (existingTweet.status === "posted") {
          continue
        }

        const updatedTweet = await this.tweets.update(existingTweet.id, {
          body: tweet.body,
          mediaURLs: tweet.mediaURLs,
        })

        if (updatedTweet) {
          this.tweetLoader
            .clear(updatedTweet.id)
            .prime(updatedTweet.id, updatedTweet)
        }
      }
    }
  }

  private hasChanges(input: UpdatePostInput, existingPost: Post): boolean {
    return (
      input.title !== existingPost.title ||
      input.url !== existingPost.url ||
      input.textContent !== existingPost.textContent ||
      input.htmlContent !== existingPost.htmlContent ||
      !isSameDate(input.publishedAt, existingPost.publishedAt) ||
      !isSameDate(input.modifiedAt, existingPost.modifiedAt)
    )
  }
}

export default ImportService
