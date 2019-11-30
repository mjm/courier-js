import { NextPage } from "next"
import withData from "../../hocs/relay"
import withSecurePage from "../../hocs/securePage"
import { graphql } from "react-relay"
import Container from "../Container"
import { ErrorContainer } from "../ErrorContainer"
import FeedDetails from "../FeedDetails"
import { FeedDetailsPageQueryResponse } from "../../lib/__generated__/FeedDetailsPageQuery.graphql"

type Props = FeedDetailsPageQueryResponse & {
  id: string
}

const FeedDetailsPage: NextPage<Props, any> = ({
  subscribedFeed,
  currentUser,
}) => {
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

FeedDetailsPage.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default withData(withSecurePage(FeedDetailsPage), {
  query: graphql`
    query FeedDetailsPageQuery($id: ID!) {
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
