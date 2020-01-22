import { translate } from "html-to-tweets"
import { injectable } from "inversify"
import { zip } from "lodash"
import { ScrapedEntry } from "scrape-feed"

import FeedSubscriptionRepository, {
  SubscribedFeedLoader,
} from "@repositories/feed_subscription_repository"
import PostRepository, { PostLoader } from "@repositories/post_repository"
import TweetRepository, { TweetLoader } from "@repositories/tweet_repository"
import NotificationService from "@services/notification_service"
import {
  BulkNewTweetInput,
  FeedId,
  FeedSubscriptionId,
  NewPostInput,
  Post,
  PostId,
  PostImportResult,
  PreviewTweet,
  SubscribedFeed,
  UpdatePostInput,
} from "lib/data/types"
import { isSameDate } from "lib/data/util"
import { EventContext } from "lib/events"

interface CreatePostPlan extends NewPostInput {
  result: "created"
}

interface UpdatePostPlan extends UpdatePostInput {
  result: "updated"
  id: PostId
  itemId: string
}

@injectable()
class ImportService {
  constructor(
    private feedSubscriptions: FeedSubscriptionRepository,
    private posts: PostRepository,
    private tweets: TweetRepository,
    private subscribedFeedLoader: SubscribedFeedLoader,
    private postLoader: PostLoader,
    private tweetLoader: TweetLoader,
    private notifications: NotificationService,
    private evt: EventContext
  ) {}

  /**
   * Import posts that were scraped from a site's feed.
   *
   * When refreshing a feed, if the content changes, all of the entries found in the
   * feed will be imported. The entries will be checked against already imported posts
   * with the same IDs to determine whether updates or creations of posts are needed.
   *
   * Creating or updating posts will cause us to create or update tweets for those posts
   * on any subscriptions the feed has. Effort is taken to batch these operations
   * together to avoid repeating work or excessively querying the database.
   *
   * @param feedId The ID of the feed the posts will belong to.
   * @param entries The entries that were scraped from the feed.
   * @returns An object with counts of how many posts were created, updated, and
   * left unchanged.
   */
  async importPosts(
    feedId: FeedId,
    entries: ScrapedEntry[]
  ): Promise<PostImportResult> {
    return await this.evt.with("import_posts", async evt => {
      evt.add({
        "feed.id": feedId,
        "import.entry_count": entries.length,
      })

      const entryIds = entries.map(e => e.id)
      const existingPosts = await this.posts.findByItemIDs(feedId, entryIds)

      const createPlans: CreatePostPlan[] = []
      const updatePlans: UpdatePostPlan[] = []
      let unchanged = 0

      for (const [entry, post] of zip(entries, existingPosts)) {
        if (!entry) {
          break
        }

        if (post) {
          const input: UpdatePostInput = {
            title: entry.title,
            url: entry.url,
            textContent: entry.textContent,
            htmlContent: entry.htmlContent,
            publishedAt: entry.publishedAt,
            modifiedAt: entry.modifiedAt,
          }

          if (!this.hasChanges(input, post)) {
            unchanged++
          } else {
            updatePlans.push({
              ...input,
              result: "updated",
              id: post.id,
              itemId: entry.id,
            })
          }
        } else {
          createPlans.push({
            result: "created",
            feedId,
            itemId: entry.id,
            title: entry.title,
            url: entry.url,
            textContent: entry.textContent,
            htmlContent: entry.htmlContent,
            publishedAt: entry.publishedAt,
            modifiedAt: entry.modifiedAt,
          })
        }
      }

      evt.add({
        "import.created_count": createPlans.length,
        "import.updated_count": updatePlans.length,
        "import.unchanged_count": unchanged,
      })

      const changedPosts: Post[] = []

      // perform all the creates
      const createdPosts = await this.posts.bulkCreate(createPlans)
      for (const post of createdPosts) {
        this.postLoader.prime(post.id, post)
        changedPosts.push(post)
      }

      // perform all the updates
      const updatedPosts = await this.posts.bulkUpdate(updatePlans)
      for (const post of updatedPosts) {
        this.postLoader.prime(post.id, post)
        changedPosts.push(post)
      }

      // create all the tweets
      if (changedPosts.length) {
        const subscriptions = await this.feedSubscriptions.findAllByFeed(feedId)
        await Promise.all(
          subscriptions.map(sub => this.createTweets(sub, changedPosts))
        )
      }

      return {
        created: createPlans.length,
        updated: updatePlans.length,
        unchanged,
      }
    })
  }

  /**
   * Creates tweets for a subscription using the most recent posts imported for the
   * feed.
   *
   * This is done when a user first subscribes to a new feed, as it lets us give a
   * consistent experience for how much content is created when subscribing.
   *
   * @param feedSubscriptionId The ID of the feed subscription to create tweets for.
   */
  async importRecentPosts(
    feedSubscriptionId: FeedSubscriptionId
  ): Promise<void> {
    await this.evt.with("import_recent_posts", async evt => {
      evt.add({ "feed.subscription_id": feedSubscriptionId })

      const feed = (await this.subscribedFeedLoader.load(
        feedSubscriptionId
      )) as SubscribedFeed
      evt.add({ "feed.id": feed.feedId })

      // translating every post for the new subscription could be an excessive amount of work,
      // and probably isn't what someone expects anyway, so we just grab the last few.
      const recentPosts = await this.posts
        .pagedByFeed(feed.feedId, { first: 10 })
        .nodes()

      evt.add({ "import.recent_post_count": recentPosts.length })

      await this.createTweets(feed, recentPosts)
    })
  }

  generatePreviewTweets(entries: ScrapedEntry[]): PreviewTweet[] {
    let results: PreviewTweet[] = []

    for (const entry of entries.slice(0, 5)) {
      const tweets = translate({
        url: entry.url,
        title: entry.title,
        html: entry.htmlContent,
      })

      const previews: PreviewTweet[] = tweets.map(t =>
        t.action === "tweet"
          ? {
              action: "tweet",
              body: t.body,
              mediaURLs: t.mediaURLs,
              retweetID: "",
            }
          : {
              action: "retweet",
              body: "",
              mediaURLs: [],
              retweetID: t.tweetID,
            }
      )
      results = [...results, ...previews]
    }

    return results
  }

  private async createTweets(
    feedSubscription: SubscribedFeed,
    posts: Post[]
  ): Promise<void> {
    await this.evt.withLeaf("create_tweets", async evt => {
      evt.add({
        "feed.id": feedSubscription.feedId,
        "feed.subscription_id": feedSubscription.id,
        "feed.autopost": feedSubscription.autopost,
        post_count: posts.length,
      })

      const tweetsToCreate = (
        await Promise.all(
          posts.map(async post => {
            return await this.planTweets(feedSubscription, post)
          })
        )
      ).flat()

      evt.add({ "tweet.create_count": tweetsToCreate.length })

      const tweets = await this.tweets.bulkCreate(
        feedSubscription.id,
        feedSubscription.autopost,
        tweetsToCreate
      )

      await this.notifications.sendTweetsImported(
        feedSubscription.userId,
        tweets,
        feedSubscription.autopost
      )

      for (const tweet of tweets) {
        this.tweetLoader.prime(tweet.id, tweet)
      }
    })
  }

  private async planTweets(
    feedSubscription: SubscribedFeed,
    post: Post
  ): Promise<BulkNewTweetInput[]> {
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
    const tweetsToCreate: BulkNewTweetInput[] = []
    const zippedTweets = zip(tweets, existingTweets).map(
      ([nt, et], i) => [i, nt, et] as const
    )
    for (const [i, tweet, existingTweet] of zippedTweets) {
      if (!existingTweet && tweet) {
        // we need to make a new tweet here

        const tweetBase = {
          postId: post.id,
          position: i,
        }

        tweetsToCreate.push(
          tweet.action === "tweet"
            ? {
                ...tweetBase,
                action: "tweet",
                body: tweet.body,
                mediaURLs: tweet.mediaURLs,
              }
            : {
                ...tweetBase,
                action: "retweet",
                retweetID: tweet.tweetID,
              }
        )
      } else if (!tweet && existingTweet) {
        // we need to delete the tweet that already exists?
        // I'm not actually sure what to do here.
      } else if (tweet && existingTweet) {
        // we need to update the existing tweet if it hasn't been posted yet
        if (existingTweet.status === "posted") {
          continue
        }

        // TODO if the creates are just plans, the updates should probably also happen
        // out of band.
        const updatedTweet = await this.tweets.update(
          existingTweet.id,
          tweet.action === "tweet"
            ? {
                action: "tweet",
                body: tweet.body,
                mediaURLs: tweet.mediaURLs,
                retweetID: "",
              }
            : {
                action: "retweet",
                body: "",
                mediaURLs: [],
                retweetID: tweet.tweetID,
              }
        )

        if (updatedTweet) {
          this.tweetLoader.replace(updatedTweet.id, updatedTweet)
        }
      }
    }

    return tweetsToCreate
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
