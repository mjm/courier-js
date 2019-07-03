import TweetRepository, {
  TweetPagingOptions,
  TweetLoader,
} from "../repositories/tweet_repository"
import { UserId, Tweet, TweetId, UpdateTweetInput } from "../data/types"
import { AuthenticationError, UserInputError } from "apollo-server-core"
import { Pager } from "../data/pager"
import { postToTwitter } from "../twitter"

class TweetService {
  constructor(
    private userId: UserId | null,
    private tweets: TweetRepository,
    private tweetLoader: TweetLoader
  ) {}

  paged(options: TweetPagingOptions = {}): Pager<Tweet, any> {
    return this.tweets.paged(this.assertUserId(), options)
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

    this.tweetLoader.clear(id).prime(id, updatedTweet)
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

    this.tweetLoader.clear(id).prime(id, updatedTweet)
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

    this.tweetLoader.clear(id).prime(id, updatedTweet)
    return updatedTweet
  }

  async post(id: TweetId): Promise<Tweet> {
    const tweet = await this.tweetLoader.load(id)
    if (!tweet) {
      throw new Error(`no tweet found with id ${id}`)
    }
    if (tweet.status !== "draft") {
      throw new UserInputError("Only a draft tweet can be posted.")
    }

    const postedTweetId = await postToTwitter({
      userId: this.assertUserId(),
      tweet,
    })

    const updatedTweet = await this.tweets.post(id, postedTweetId)
    if (!updatedTweet) {
      // another request squeezed in between our initial fetch and our update.
      // this is probably fine: Twitter silently rejects duplicate posts that are
      // close together.
      // just refetch the tweet and return that as if we did it here.
      return (await this.tweetLoader.clear(id).load(id))!
    }

    this.tweetLoader.clear(id).prime(id, updatedTweet)
    return updatedTweet
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

export default TweetService
