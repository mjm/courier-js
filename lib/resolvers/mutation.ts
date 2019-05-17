import { MutationResolvers } from "../generated/graphql"
import { addFeed, refreshFeed, deleteFeed } from "../data/feed"
import { cancelTweet, uncancelTweet, postTweet, editTweet } from "../data/tweet"

export const Mutation: MutationResolvers = {
  async addFeed(_, { input }, { getUser }) {
    const { sub } = await getUser()
    return { feed: await addFeed({ ...input, userId: sub }) }
  },

  async refreshFeed(_, { input }, { getUser }) {
    await getUser()
    return { feed: await refreshFeed(input.id) }
  },

  async deleteFeed(_, { input }, { getUser }) {
    const { sub } = await getUser()
    await deleteFeed(sub, input.id)
    return { id: input.id }
  },

  async cancelTweet(_, { input }, { getUser }) {
    const { sub } = await getUser()
    return { tweet: await cancelTweet(sub, input.id) }
  },

  async uncancelTweet(_, { input }, { getUser }) {
    const { sub } = await getUser()
    return { tweet: await uncancelTweet(sub, input.id) }
  },

  async postTweet(_, { input }, { getUser }) {
    const { sub } = await getUser()

    if (input.body) {
      await editTweet(sub, { id: input.id, body: input.body })
    }

    return { tweet: await postTweet(sub, input.id) }
  },

  async editTweet(_, { input }, { getUser }) {
    const { sub } = await getUser()
    return { tweet: await editTweet(sub, input) }
  },
}
