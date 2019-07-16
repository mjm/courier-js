import TweetRepository, {
  TweetPagingOptions,
  TweetLoader,
} from "../repositories/tweet_repository"
import { UserId, Tweet, TweetId, UpdateTweetInput } from "../data/types"
import { UserInputError } from "apollo-server-core"
import { Pager } from "../data/pager"
import { SubscribedFeedLoader } from "../repositories/feed_subscription_repository"
import TwitterService from "./twitter_service"
import { injectable, inject } from "inversify"
import * as keys from "../key"
import EventService from "./event_service"
import BillingService from "./billing_service"

export interface PostQueuedResult {
  succeeded: number
  failed: number
}

@injectable()
class TweetService {
  constructor(
    private tweets: TweetRepository,
    private tweetLoader: TweetLoader,
    private subscribedFeedLoader: SubscribedFeedLoader,
    @inject(keys.UserId) private getUserId: () => Promise<UserId>,
    private twitter: TwitterService,
    private events: EventService,
    private billing: BillingService
  ) {}

  async paged(options: TweetPagingOptions = {}): Promise<Pager<Tweet, any>> {
    return this.tweets.paged(await this.getUserId(), options)
  }

  async cancel(id: TweetId): Promise<Tweet> {
    const tweet = await this.tweetLoader.load(id)
    if (!tweet) {
      throw new Error(`no tweet found with id ${id}`)
    }

    const updatedTweet = await this.tweets.cancel(id)
    if (!updatedTweet) {
      throw new UserInputError("An already posted tweet cannot be canceled.")
    }

    this.tweetLoader.replace(id, updatedTweet)
    await this.events.record("tweet_cancel", { tweetId: id })

    return updatedTweet
  }

  async uncancel(id: TweetId): Promise<Tweet> {
    const tweet = await this.tweetLoader.load(id)
    if (!tweet) {
      throw new Error(`no tweet found with id ${id}`)
    }

    const updatedTweet = await this.tweets.uncancel(id)
    if (!updatedTweet) {
      throw new UserInputError(`A ${tweet.status} tweet cannot be uncanceled.`)
    }

    this.tweetLoader.replace(id, updatedTweet)
    await this.events.record("tweet_uncancel", { tweetId: id })

    return updatedTweet
  }

  async update(id: TweetId, input: UpdateTweetInput): Promise<Tweet> {
    const tweet = await this.tweetLoader.load(id)
    if (!tweet) {
      throw new Error(`no tweet found with id ${id}`)
    }
    if (tweet.status !== "draft") {
      throw new UserInputError("Only a draft tweet can be edited.")
    }

    const updatedTweet = await this.tweets.update(id, input)
    if (!updatedTweet) {
      throw new UserInputError(`A ${tweet.status} tweet cannot be edited.`)
    }

    this.tweetLoader.replace(id, updatedTweet)
    await this.events.record("tweet_edit", { tweetId: id })

    return updatedTweet
  }

  async post(id: TweetId): Promise<Tweet> {
    if (!(await this.billing.isSubscribed())) {
      throw new Error("You cannot post tweets without an active subscription.")
    }

    const tweet = await this.tweetLoader.load(id)
    if (!tweet) {
      throw new Error(`no tweet found with id ${id}`)
    }
    if (tweet.status !== "draft") {
      throw new UserInputError("Only a draft tweet can be posted.")
    }

    const postedTweet = await this.doPost(await this.getUserId(), tweet)
    await this.events.record("tweet_post", { tweetId: id })
    return postedTweet
  }

  async postQueued(): Promise<PostQueuedResult> {
    const tweets = await this.tweets.findAllPostable()

    const results = { succeeded: 0, failed: 0 }
    for (const tweet of tweets) {
      try {
        const feed = (await this.subscribedFeedLoader.load(
          tweet.feedSubscriptionId
        ))!

        if (!(await this.billing.isUserSubscribed(feed.userId))) {
          console.log(
            `User ${feed.userId} is not currently subscribed. Removing tweet ${
              tweet.id
            } from queue.`
          )
          await this.tweets.dequeue(tweet.id)
          continue
        }

        await this.doPost(feed.userId, tweet)
        await this.events.record(
          "tweet_autopost",
          { tweetId: tweet.id },
          { asUser: feed.userId }
        )
        results.succeeded++
      } catch (e) {
        // log the error but don't fail the request, or we'll fail other tweets
        console.error("Error posting queued tweet:", e)
        results.failed++
      }
    }

    return results
  }

  private async doPost(userId: UserId, tweet: Tweet): Promise<Tweet> {
    const postedTweetId = await this.twitter.tweet(userId, tweet)

    const updatedTweet = await this.tweets.post(tweet.id, postedTweetId)
    if (!updatedTweet) {
      // another request squeezed in between our initial fetch and our update.
      // this is probably fine: Twitter silently rejects duplicate posts that are
      // close together.
      // just refetch the tweet and return that as if we did it here.
      return (await this.tweetLoader.reload(tweet.id))!
    }

    this.tweetLoader.replace(updatedTweet.id, updatedTweet)
    return updatedTweet
  }
}

export default TweetService
