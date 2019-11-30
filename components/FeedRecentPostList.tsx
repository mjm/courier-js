import Card, { CardHeader } from "./Card"
import Moment from "react-moment"
import striptags from "striptags"
import {
  createFragmentContainer,
  graphql,
  Environment,
  RelayProp,
} from "react-relay"
import { FeedRecentPostList_feed } from "../lib/__generated__/FeedRecentPostList_feed.graphql"
import { useErrors } from "./ErrorContainer"
import { Button } from "./Button"
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons"
import { refreshFeed } from "./mutations/RefreshFeed"
import InfoField from "./InfoField"
import InfoTable from "./InfoTable"

interface Props {
  feed: FeedRecentPostList_feed
  relay: RelayProp
}

const FeedRecentPostList: React.FC<Props> = ({
  feed,
  relay: { environment },
}) => {
  return (
    <Card>
      <CardHeader>Recent Posts</CardHeader>
      <InfoField label="Last Checked">
        <Moment fromNow>{feed.refreshedAt}</Moment>
      </InfoField>
      <InfoTable>
        <colgroup>
          <col />
          <col css={{ width: "150px" }} />
        </colgroup>
        <tbody>
          {feed.posts.edges.map(({ node }) => (
            <tr key={node.id}>
              <td>
                <a href={node.url} target="_blank">
                  {node.title || striptags(node.htmlContent)}
                </a>
              </td>
              <td>
                <Moment fromNow>{node.publishedAt}</Moment>
              </td>
            </tr>
          ))}
        </tbody>
      </InfoTable>
      <RefreshButton environment={environment} id={feed.id} />
    </Card>
  )
}

export default createFragmentContainer(FeedRecentPostList, {
  feed: graphql`
    fragment FeedRecentPostList_feed on Feed {
      id
      refreshedAt
      posts(first: 5) @connection(key: "FeedRecentPostList_posts") {
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

interface RefreshButtonProps {
  id: string
  environment: Environment
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ id, environment }) => {
  const { setError, clearErrors } = useErrors()

  return (
    <Button
      mt={3}
      icon={faSyncAlt}
      useSameIconWhileSpinning
      onClickAsync={async () => {
        try {
          await refreshFeed(environment, id)
          clearErrors()
        } catch (err) {
          setError(err)
        }
      }}
    >
      Refresh
    </Button>
  )
}
