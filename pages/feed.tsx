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
import { spacing, colors } from "../utils/theme"
import Box from "../components/box"

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
              <div>
                <Head title={`${feed.feed.title} - Details`} />

                <PageHeader className="header">{feed.feed.title}</PageHeader>
                <Box>
                  <div className="field">
                    <div className="label">Feed URL</div>
                    <div className="entry">
                      <a href={feed.feed.url}>{feed.feed.url}</a>
                    </div>
                  </div>
                  <div className="field">
                    <div className="label">Home Page</div>
                    <div className="entry">
                      <a href={feed.feed.homePageURL}>
                        {feed.feed.homePageURL}
                      </a>
                    </div>
                  </div>
                  <div className="field">
                    <div className="label">Last Checked</div>
                    <div className="entry">
                      <Moment fromNow>{feed.feed.refreshedAt}</Moment>
                    </div>
                  </div>
                  <div className="field">
                    <div className="label">Autopost</div>
                    <div className="entry">{feed.autopost ? "Yes" : "No"}</div>
                  </div>
                </Box>
              </div>
            )
          } else {
            return <p>Can't find that feed.</p>
          }
        }}
      </GetFeedDetailsComponent>
      <style jsx>{`
        div :global(.header) {
          margin-bottom: ${spacing(6)};
        }
        .field {
          display: flex;
          padding: ${spacing(1)} 0;
        }
        .label {
          width: 180px;
          color: ${colors.primary[800]};
          font-weight: 500;
        }
        .entry {
          color: ${colors.gray[900]};
        }
        a {
          text-decoration: none;
        }
      `}</style>
    </Container>
  )
}

Feed.getInitialProps = ({ query }: NextContext<any>): Props => {
  return { id: query.id }
}

export default withSecurePage(withData(Feed))
