import React, { useState, useRef } from "react"
import Container from "../components/container"
import Head from "../components/head"
import { PageHeader } from "../components/header"
import withSecurePage from "../hocs/securePage"
import withData from "../hocs/apollo"
import { NextContext } from "next"
import {
  GetFeedDetailsComponent,
  RefreshFeedComponent,
  UpcomingTweetsDocument,
  DeleteFeedComponent,
  AllFeedsDocument,
} from "../lib/generated/graphql-components"
import Loading from "../components/loading"
import { ErrorBox } from "../components/error"
import Moment from "react-moment"
import { spacing, colors } from "../utils/theme"
import Box, { BoxHeader, BoxButtons } from "../components/box"
import {
  faTrashAlt,
  faSyncAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "../components/button"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription,
} from "@reach/alert-dialog"
import Router from "next/router"

interface Props {
  id: string
}

const Feed = ({ id }: Props) => {
  const [actionError, setActionError] = useState<Error | undefined>()

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
                <Head title={`${feed.feed.title} - Feed Details`} />

                <PageHeader className="header">{feed.feed.title}</PageHeader>
                <ErrorBox error={actionError} />
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
                  <BoxButtons>
                    <RefreshButton
                      id={feed.feed.id}
                      setError={setActionError}
                    />
                  </BoxButtons>
                </Box>
                <Box>
                  <BoxHeader>Autoposting</BoxHeader>
                  <div>
                    Courier is importing tweets from this feed, but they{" "}
                    <strong>will not be posted automatically.</strong>
                  </div>
                  <BoxButtons>
                    <Button
                      icon={faTwitter}
                      disabled
                      title="Autoposting is not currently supported."
                    >
                      Turn On Autoposting
                    </Button>
                  </BoxButtons>
                </Box>
                <Box>
                  <BoxHeader>Remove This Feed</BoxHeader>
                  <div>
                    If you remove this feed, Courier will stop seeing new posts
                    from it. Tweets that have already been imported from this
                    feed's posts will not be affected.
                  </div>
                  <BoxButtons>
                    <RemoveButton id={feed.id} />
                  </BoxButtons>
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
          line-height: 1.8em;
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

interface RefreshButtonProps {
  id: string
  setError: (err: Error | undefined) => void
}

const RefreshButton = ({ id, setError }: RefreshButtonProps) => {
  const [refreshing, setRefreshing] = useState(false)

  return (
    <RefreshFeedComponent refetchQueries={[{ query: UpcomingTweetsDocument }]}>
      {refreshFeed => (
        <Button
          spin={refreshing}
          icon={faSyncAlt}
          useSameIconWhileSpinning
          onClick={async () => {
            setRefreshing(true)
            try {
              await refreshFeed({ variables: { input: { id } } })
              setError(undefined)
            } catch (err) {
              setError(err)
            } finally {
              setRefreshing(false)
            }
          }}
        >
          Refresh
        </Button>
      )}
    </RefreshFeedComponent>
  )
}

interface RemoveButtonProps {
  id: string
}

const RemoveButton = ({ id }: RemoveButtonProps) => {
  const [showDialog, setShowDialog] = useState(false)
  const buttonRef = useRef(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function closeDialog() {
    setShowDialog(false)
  }

  return (
    <DeleteFeedComponent
      refetchQueries={[{ query: AllFeedsDocument }]}
      awaitRefetchQueries
    >
      {deleteFeed => (
        <>
          <Button
            color="red"
            invert
            icon={faTrashAlt}
            onClick={() => setShowDialog(true)}
          >
            Remove Feed
          </Button>

          {showDialog && (
            <AlertDialog
              leastDestructiveRef={buttonRef}
              onDismiss={closeDialog}
            >
              <AlertDialogLabel>Are you sure?</AlertDialogLabel>

              <AlertDialogDescription>
                Are you sure you want to delete this feed from your account?
              </AlertDialogDescription>

              <div>
                <Button
                  color="red"
                  icon={faTrashAlt}
                  spin={isDeleting}
                  onClick={async () => {
                    setIsDeleting(true)
                    try {
                      await deleteFeed({
                        variables: { input: { id } },
                      })
                      setShowDialog(false)
                      Router.push("/feeds")
                    } catch (err) {
                      console.error(err)
                    } finally {
                      setIsDeleting(false)
                    }
                  }}
                >
                  Remove Feed
                </Button>
                <Button ref={buttonRef} icon={faTimes} onClick={closeDialog}>
                  Don't Remove
                </Button>
              </div>
            </AlertDialog>
          )}
        </>
      )}
    </DeleteFeedComponent>
  )
}

export default withSecurePage(withData(Feed))
