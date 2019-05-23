import React from "react"
import Container from "../components/container"
import Head from "../components/head"
import { PageHeader } from "../components/header"
import withSecurePage from "../hocs/securePage"
import withData from "../hocs/apollo"
import { NextContext } from "next"
import { GetFeedDetailsComponent } from "../lib/generated/graphql-components"
import Loading from "../components/loading"
import { ErrorBox } from "../components/error"
import Moment from "react-moment"

interface Props {
  id: string
}

const Feed = ({ id }: Props) => {
  return (
    <Container>
      <GetFeedDetailsComponent variables={{ id }}>
        {({ data, error, loading }) => {
          if (loading) {
            return <Loading />
          }

          if (error) {
            return <ErrorBox error={error} />
          }

          if (!data) {
            return null
          }
          const feed = data.subscribedFeed
          if (feed) {
            return (
              <>
                <Head title={`${feed.feed.title} - Details`} />

                <PageHeader>{feed.feed.title}</PageHeader>
                <div>
                  <p>{feed.feed.url}</p>
                  <p>{feed.feed.homePageURL}</p>
                  <p>
                    <Moment>{feed.feed.refreshedAt}</Moment>
                  </p>
                  <p>Autopost? {feed.autopost ? "Yes" : "No"}</p>
                </div>
              </>
            )
          } else {
            return <p>Can't find that feed.</p>
          }
        }}
      </GetFeedDetailsComponent>
    </Container>
  )
}

Feed.getInitialProps = ({ query }: NextContext<any>): Props => {
  return { id: query.id }
}

export default withSecurePage(withData(Feed))
