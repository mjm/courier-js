import { TweetResolvers } from "../generated/graphql"

export const TweetStatus = {
  DRAFT: "draft",
  CANCELED: "canceled",
  POSTED: "posted",
}

export const Tweet: TweetResolvers = {
  async post({ postId }, {}, { loaders }) {
    return (await loaders.posts.load(postId))!
  },
}
