import { PostResolvers } from "../generated/graphql"

export const Post: PostResolvers = {
  async feed({ feedId }, {}, { loaders }) {
    return (await loaders.feeds.load(feedId))!
  },
}
