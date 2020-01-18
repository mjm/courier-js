import { NodeResolvers } from "lib/generated/graphql"

export const Node: NodeResolvers = {
  __resolveType(node) {
    if ("postedTweetID" in node) {
      return "Tweet"
    } else if ("homePageURL" in node) {
      return "Feed"
    } else if ("autopost" in node) {
      return "SubscribedFeed"
    } else if ("itemId" in node) {
      return "Post"
    } else if ("eventType" in node) {
      return "Event"
    } else if ("token" in node) {
      return "DeviceToken"
    }

    return null
  },
}
