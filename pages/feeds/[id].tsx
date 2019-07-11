import React, { useState, useRef } from "react"
import Container, { FlushContainer } from "../../components/container"
import Head from "../../components/head"
import { PageHeader } from "../../components/header"
import withSecurePage from "../../hocs/securePage"
import withData from "../../hocs/apollo"
import { NextPageContext } from "next"
import {
  GetFeedDetailsComponent,
  RefreshFeedComponent,
  UpcomingTweetsDocument,
  DeleteFeedComponent,
  AllFeedsDocument,
  AllFeedSubscriptionsFieldsFragment,
  SetFeedOptionsComponent,
} from "../../lib/generated/graphql-components"
import Loading from "../../components/loading"
import { ErrorBox } from "../../components/error"
import Moment from "react-moment"
import {
  faTrashAlt,
  faSyncAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../components/button"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription,
} from "@reach/alert-dialog"
import Router from "next/router"
import { InfoField, InfoTable } from "../../components/info"
import Card, { CardHeader } from "../../components/card"
import Group from "../../components/group"
import URL from "../../components/url"

interface Props {
  id: string
}

const Feed = ({ id }: Props) => {
  const [actionError, setActionError] = useState<Error | undefined>()

  return (
    <Container
      css={{
        a: { textDecoration: "none" },
      }}
    >
      <GetFeedDetailsComponent variables={{ id }}>
        {({ data, error, loading }) => {
          if (loading) {
            return (
              <>
                <Head title="Feed Details" />
                <Loading />
              </>
            )
          }

          if (error) {
            return (
              <>
                <Head title="Feed Details" />
                <ErrorBox error={error} />
              </>
            )
          }

          if (!data) {
            return null
          }
          const feed = data.subscribedFeed
          if (feed) {
            return (
              <>
                <Head title={`${feed.feed.title} - Feed Details`} />

                <PageHeader mb={4}>{feed.feed.title}</PageHeader>
                <FlushContainer>
                  <Group direction="column" spacing={3}>
                    <ErrorBox error={actionError} />
                    <Card>
                      <InfoField label="Feed URL">
                        <a href={feed.feed.url}>
                          <URL>{feed.feed.url}</URL>
                        </a>
                      </InfoField>
                      <InfoField label="Home Page">
                        <a href={feed.feed.homePageURL}>
                          <URL>{feed.feed.homePageURL}</URL>
                        </a>
                      </InfoField>
                    </Card>
                    <Card>
                      <CardHeader>Recent Posts</CardHeader>
                      <InfoField label="Last Checked">
                        <Moment fromNow>{feed.feed.refreshedAt}</Moment>
                      </InfoField>
                      <InfoTable>
                        <colgroup>
                          <col />
                          <col css={{ width: "150px" }} />
                        </colgroup>
                        <tbody>
                          {feed.feed.posts.nodes.map(post => (
                            <tr key={post.id}>
                              <td>
                                <a href={post.url} target="_blank">
                                  {post.title || post.htmlContent}
                                </a>
                              </td>
                              <td>
                                <Moment fromNow>{post.publishedAt}</Moment>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </InfoTable>
                      <RefreshButton
                        id={feed.feed.id}
                        setError={setActionError}
                      />
                    </Card>
                    <Card>
                      <CardHeader>Autoposting</CardHeader>
                      {feed.autopost ? (
                        <div>
                          Courier is importing tweets from this feed and{" "}
                          <strong>
                            will post them to Twitter automatically.
                          </strong>
                        </div>
                      ) : (
                        <div>
                          Courier is importing tweets from this feed, but they{" "}
                          <strong>will not be posted automatically.</strong>
                        </div>
                      )}
                      <AutopostButton feed={feed} />
                    </Card>
                    <Card>
                      <CardHeader>Remove This Feed</CardHeader>
                      <div>
                        If you remove this feed, Courier will stop seeing new
                        posts from it. Tweets that have already been imported
                        from this feed's posts will not be affected.
                      </div>
                      <RemoveButton id={feed.id} />
                    </Card>
                  </Group>
                </FlushContainer>
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

Feed.getInitialProps = async ({ query }: NextPageContext): Promise<Props> => {
  // @ts-ignore
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
          mt={3}
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

interface AutopostButtonProps {
  feed: AllFeedSubscriptionsFieldsFragment
}

const AutopostButton = ({ feed }: AutopostButtonProps) => {
  const [isUpdating, setUpdating] = useState(false)

  return (
    <SetFeedOptionsComponent>
      {setOptions => (
        <Button
          mt={3}
          spin={isUpdating}
          icon={faTwitter}
          onClick={async () => {
            setUpdating(true)
            try {
              await setOptions({
                variables: { input: { id: feed.id, autopost: !feed.autopost } },
              })
            } finally {
              setUpdating(false)
            }
          }}
        >
          Turn {feed.autopost ? "Off" : "On"} Autoposting
        </Button>
      )}
    </SetFeedOptionsComponent>
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
            mt={3}
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

              <Group direction="row" spacing={2} mt={3}>
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
              </Group>
            </AlertDialog>
          )}
        </>
      )}
    </DeleteFeedComponent>
  )
}

export default withData(withSecurePage(Feed))
