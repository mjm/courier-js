import { NextPage } from "next"
import withData from "../../hocs/relay"
import withSecurePage from "../../hocs/securePage"
import { graphql } from "react-relay"
import { IdQueryResponse } from "../../lib/__generated__/IdQuery.graphql"
import Container from "../../components/container"
import { ErrorContainer } from "../../hooks/error"
import FeedDetails from "../../components/FeedDetails"

type Props = IdQueryResponse & {
  id: string
}

const Feed: NextPage<Props, any> = ({ subscribedFeed, currentUser }) => {
  if (!subscribedFeed || !currentUser) {
    // TODO I think this means there's no such feed
    return <></>
  }

  return (
    <Container
      css={{
        a: { textDecoration: "none" },
      }}
    >
      <ErrorContainer>
        <FeedDetails feed={subscribedFeed} user={currentUser} />
      </ErrorContainer>
    </Container>
  )
}

Feed.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default withData(withSecurePage(Feed), {
  query: graphql`
    query IdQuery($id: ID!) {
      subscribedFeed(id: $id) {
        ...FeedDetails_feed
      }
      currentUser {
        ...FeedDetails_user
      }
    }
  `,
  getVariables({ id }) {
    return { id }
  },
})
