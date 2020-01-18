import Moment from "react-moment"
import striptags from "striptags"
import { createFragmentContainer, graphql } from "react-relay"
import { FeedRecentPostList_feed } from "@generated/FeedRecentPostList_feed.graphql"

const FeedRecentPostList: React.FC<{
  feed: FeedRecentPostList_feed
}> = ({ feed }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
      {feed.posts.edges.map(({ node }) => (
        <a
          key={node.id}
          className={`p-4 flex items-baseline justify-stretch border-neutral-2 border-t first:border-0 group hover:bg-primary-1`}
          href={node.url}
          target="_blank"
        >
          <div className="flex-grow truncate text-neutral-10 group-hover:text-primary-10">
            {node.title ? (
              <span className="font-medium">{node.title}</span>
            ) : (
              striptags(node.htmlContent)
            )}
          </div>
          <div className="flex-shrink-0 ml-4 text-sm text-neutral-8 group-hover:text-primary-9">
            <Moment fromNow>{node.publishedAt}</Moment>
          </div>
        </a>
      ))}
    </div>
  )
}

export default createFragmentContainer(FeedRecentPostList, {
  feed: graphql`
    fragment FeedRecentPostList_feed on Feed {
      posts(first: 10) @connection(key: "FeedRecentPostList_posts") {
        edges {
          node {
            id
            url
            title
            htmlContent
            publishedAt
          }
        }
      }
    }
  `,
})
