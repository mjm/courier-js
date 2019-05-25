import React, { useState } from "react"
import Head from "../components/head"
import {
  PageHeader,
  PageDescription,
  SectionHeader,
} from "../components/header"
import {
  UpcomingTweetsComponent,
  PastTweetsComponent,
  AllTweetsFieldsFragment,
  Tweet,
  CancelTweetComponent,
  TweetStatus,
  UncancelTweetComponent,
  PostTweetComponent,
  EditTweetComponent,
} from "../lib/generated/graphql-components"
import withSecurePage from "../hocs/securePage"
import withData from "../hocs/apollo"
import { spacing, shadow, colors } from "../utils/theme"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAngleDoubleDown,
  faBan,
  faSpinner,
  faEdit,
  faCheck,
  faShare,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons"
import Loading from "../components/loading"
import { PillButton } from "../components/button"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import Moment from "react-moment"
import { ErrorBox } from "../components/error"
import { Formik, Form, Field, FieldArray } from "formik"
import * as linkify from "linkifyjs"
import mention from "linkifyjs/plugins/mention"
import Linkify from "linkifyjs/react"
import Container from "../components/container"
import Box, { BoxButtons } from "../components/box"

mention(linkify)

const Tweets = ({ user }: any) => (
  <Container>
    <Head title="Your Tweets" />

    <PageHeader>Your Tweets</PageHeader>
    <PageDescription>
      These are the tweets Courier has translated from your feeds.
    </PageDescription>
    <TweetsList
      title="Upcoming Tweet"
      query={UpcomingTweetsComponent}
      user={user}
    />
    <TweetsList title="Past Tweet" query={PastTweetsComponent} user={user} />
  </Container>
)

export default withSecurePage(withData(Tweets))

interface TweetsListProps {
  // this type should match both upcoming and past.
  // we just had to pick one to use to grab the type
  query: typeof UpcomingTweetsComponent

  title: string
  user: any
}
const TweetsList = ({
  query: QueryComponent,
  title,
  user,
}: TweetsListProps) => {
  const [isLoadingMore, setLoadingMore] = useState(false)

  return (
    <div>
      <QueryComponent>
        {({ data, error, loading, fetchMore }) => {
          if (loading) {
            return (
              <>
                <h2>{title}s</h2>
                <Loading />
              </>
            )
          }

          if (error) {
            return (
              <>
                <h2>{title}s</h2>
                <ErrorBox error={error} />
              </>
            )
          }

          if (!data) {
            return null
          }

          const { nodes, pageInfo, totalCount } = data.allTweets
          if (!nodes.length) {
            return null
          }

          const loadMore = async () => {
            setLoadingMore(true)
            try {
              await fetchMore({
                variables: {
                  cursor: pageInfo.endCursor,
                },
                updateQuery(previousResult, { fetchMoreResult }) {
                  if (!fetchMoreResult) {
                    return previousResult
                  }
                  const oldNodes = previousResult.allTweets.nodes
                  const {
                    nodes: newNodes,
                    pageInfo,
                    totalCount,
                  } = fetchMoreResult.allTweets

                  return {
                    allTweets: {
                      __typename: "TweetConnection",
                      nodes: [...oldNodes, ...newNodes],
                      pageInfo,
                      totalCount,
                    },
                  }
                },
              })
            } catch (err) {
              console.error(err)
            } finally {
              setLoadingMore(false)
            }
          }

          return (
            <>
              <SectionHeader>
                {totalCount} {title}
                {totalCount === 1 ? "" : "s"}
              </SectionHeader>
              <ul>
                {nodes.map(tweet => (
                  <TweetCard key={tweet.id} tweet={tweet} user={user} />
                ))}
                {pageInfo.hasPreviousPage && (
                  <li>
                    <LoadMoreButton
                      isLoading={isLoadingMore}
                      onClick={loadMore}
                    />
                  </li>
                )}
              </ul>
            </>
          )
        }}
      </QueryComponent>
      <style jsx>{`
        ul {
          list-style: none;
          padding-left: 0;
        }
      `}</style>
    </div>
  )
}

interface TweetCardProps {
  tweet: AllTweetsFieldsFragment
  user: any
}

const TweetCard = ({ tweet, user }: TweetCardProps) => {
  const [editing, setEditing] = useState(false)

  const appearance =
    tweet.status === TweetStatus.Canceled ? "canceled" : "normal"

  return (
    <li>
      <Box appearance={appearance}>
        {editing ? (
          <EditTweetCard
            tweet={tweet}
            onStopEditing={() => setEditing(false)}
          />
        ) : (
          <ViewTweetCard
            tweet={tweet}
            user={user}
            onEdit={() => setEditing(true)}
          />
        )}
      </Box>
    </li>
  )
}

interface ViewTweetCardProps {
  tweet: AllTweetsFieldsFragment
  user: any
  onEdit: () => void
}

const ViewTweetCard = ({ tweet, user, onEdit }: ViewTweetCardProps) => {
  return (
    <div>
      <div className="body">
        <Linkify
          options={{
            formatHref: {
              mention: val => `https://twitter.com${val}`,
            },
            target: "_blank",
          }}
        >
          {tweet.body}
        </Linkify>
      </div>
      {tweet.mediaURLs.length ? (
        <div className="media">
          {tweet.mediaURLs.map(url => (
            <figure key={url}>
              <img src={url} />
            </figure>
          ))}
        </div>
      ) : null}
      <BoxButtons>
        {tweet.status === TweetStatus.Draft && (
          <>
            <CancelButton id={tweet.id} />
            <PillButton invert onClick={onEdit}>
              <FontAwesomeIcon icon={faEdit} />
              Edit Tweet
            </PillButton>
            <PostButton id={tweet.id} />
          </>
        )}
        {tweet.status === TweetStatus.Canceled && (
          <div className="status">
            canceled. <UncancelButton id={tweet.id} />
          </div>
        )}
        {tweet.status === TweetStatus.Posted && (
          <div className="status">
            <a
              href={`https://twitter.com/${user.nickname}/status/${
                tweet.postedTweetID
              }`}
              target="_blank"
            >
              tweeted <Moment fromNow>{tweet.postedAt}</Moment>
            </a>
          </div>
        )}
      </BoxButtons>
      <style jsx>{`
        .body {
          white-space: pre-wrap;
          line-height: 1.5em;
        }
        .media {
          margin-top: ${spacing(3)};
          display: flex;
          flex-wrap: wrap;
        }
        figure {
          margin: 0;
          padding: 0 ${spacing(1)};
          width: 50%;
        }
        img {
          width: 100%;
          border-radius: 1rem;
        }
        .status {
          font-size: 0.9rem;
          font-style: italic;
          color: ${colors.gray[600]};
        }

        @media (min-width: 640px) {
          figure {
            width: 25%;
          }
        }
      `}</style>
    </div>
  )
}

interface EditTweetCardProps {
  tweet: AllTweetsFieldsFragment
  onStopEditing: () => void
}

type FormValues = Pick<AllTweetsFieldsFragment, "body" | "mediaURLs"> & {
  action: "save" | "post"
}

const EditTweetCard = ({ tweet, onStopEditing }: EditTweetCardProps) => {
  const initialValues: FormValues = {
    body: tweet.body,
    mediaURLs: tweet.mediaURLs,
    action: "save",
  }
  return (
    <div>
      <PostTweetComponent>
        {postTweet => (
          <EditTweetComponent>
            {editTweet => (
              <Formik
                initialValues={initialValues}
                initialStatus={{ error: null }}
                isInitialValid
                onSubmit={async ({ action, ...values }, actions) => {
                  const input = { id: tweet.id, ...values }
                  try {
                    if (action === "save") {
                      await editTweet({ variables: { input } })
                    } else {
                      await postTweet({ variables: { input } })
                    }
                    onStopEditing()
                  } catch (err) {
                    actions.setStatus({ error: err })
                  } finally {
                    actions.setSubmitting(false)
                  }
                }}
              >
                {({
                  isSubmitting,
                  setFieldValue,
                  submitForm,
                  status,
                  values,
                }) => {
                  function submit(action: FormValues["action"]) {
                    setFieldValue("action", action)
                    // allow the previous line to rerender the component before doing this
                    setTimeout(() => submitForm(), 0)
                  }

                  function submitting(action: FormValues["action"]) {
                    return isSubmitting && action === values.action
                  }

                  function canAddMedia() {
                    return values.mediaURLs.length < 4
                  }

                  return (
                    <Form>
                      <ErrorBox error={status.error} />
                      <Field name="body" component="textarea" autoFocus />
                      <FieldArray name="mediaURLs">
                        {({ insert, remove, push }) => (
                          <>
                            {values.mediaURLs.map((_url, index) => (
                              <div key={index} className="media-url">
                                <Field
                                  name={`mediaURLs.${index}`}
                                  placeholder="https://example.org/photo.jpg"
                                />
                                <PillButton
                                  onClick={() => insert(index, "")}
                                  disabled={!canAddMedia()}
                                >
                                  <FontAwesomeIcon icon={faPlus} />
                                  Add Above
                                </PillButton>
                                <PillButton
                                  onClick={() => remove(index)}
                                  color="red"
                                >
                                  <FontAwesomeIcon icon={faTrashAlt} />
                                  Remove
                                </PillButton>
                              </div>
                            ))}
                            <PillButton
                              onClick={() => push("")}
                              className="add"
                              disabled={!canAddMedia()}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                              Add Media
                            </PillButton>
                          </>
                        )}
                      </FieldArray>
                      <BoxButtons>
                        <PillButton
                          disabled={isSubmitting}
                          color="red"
                          invert
                          onClick={onStopEditing}
                        >
                          <FontAwesomeIcon icon={faBan} />
                          Discard Changes
                        </PillButton>
                        <PillButton
                          disabled={isSubmitting}
                          invert
                          onClick={() => submit("save")}
                        >
                          <FontAwesomeIcon
                            icon={submitting("save") ? faSpinner : faCheck}
                            spin={submitting("save")}
                          />
                          Save Draft
                        </PillButton>
                        <PillButton
                          disabled={isSubmitting}
                          color="blue"
                          invert
                          onClick={() => submit("post")}
                        >
                          <FontAwesomeIcon
                            icon={submitting("post") ? faSpinner : faShare}
                            spin={submitting("post")}
                          />
                          Post Now
                        </PillButton>
                      </BoxButtons>
                    </Form>
                  )
                }}
              </Formik>
            )}
          </EditTweetComponent>
        )}
      </PostTweetComponent>
      <style jsx>{`
        div :global(textarea) {
          width: 100%;
          height: ${spacing(25)};
          padding: ${spacing(2)};
          color: ${colors.primary[900]};
          background-color: ${colors.primary[100]};
          border-radius: 0.5rem;
          border: 2px solid ${colors.primary[500]};
          line-height: 1.5em;
          outline: none;
        }
        .media-url {
          display: flex;
          align-items: center;
          padding: ${spacing(1)} 0;
        }
        .media-url > :global(input) {
          flex-grow: 1;
          margin-right: ${spacing(2)};
          padding: ${spacing(2)};
          color: ${colors.primary[900]};
          background-color: ${colors.primary[100]};
          border: 0;
          border-bottom: 2px solid ${colors.primary[500]};
          outline: none;
        }
        .media-url > :global(button) {
          flex-shrink: 0;
        }
        div :global(.add) {
          margin-top: ${spacing(1)};
        }
      `}</style>
    </div>
  )
}

interface CancelButtonProps {
  id: Tweet["id"]
}
const CancelButton = ({ id }: CancelButtonProps) => {
  return (
    <CancelTweetComponent>
      {cancelTweet => (
        <PillButton
          color="red"
          invert
          onClick={() => {
            cancelTweet({
              variables: { input: { id } },
              optimisticResponse: {
                __typename: "Mutation",
                cancelTweet: {
                  __typename: "CancelTweetPayload",
                  tweet: {
                    __typename: "Tweet",
                    id,
                    status: TweetStatus.Canceled,
                  },
                },
              },
            })
          }}
        >
          <FontAwesomeIcon icon={faBan} />
          Don't Post
        </PillButton>
      )}
    </CancelTweetComponent>
  )
}

const UncancelButton = ({ id }: CancelButtonProps) => {
  return (
    <UncancelTweetComponent>
      {uncancelTweet => (
        <a
          href="javascript:void(0)"
          onClick={() => {
            uncancelTweet({
              variables: { input: { id } },
              optimisticResponse: {
                __typename: "Mutation",
                uncancelTweet: {
                  __typename: "UncancelTweetPayload",
                  tweet: {
                    __typename: "Tweet",
                    id,
                    status: TweetStatus.Draft,
                  },
                },
              },
            })
          }}
        >
          undo?
        </a>
      )}
    </UncancelTweetComponent>
  )
}

const PostButton = ({ id }: CancelButtonProps) => {
  const [posting, setPosting] = useState(false)

  return (
    <PostTweetComponent>
      {postTweet => (
        <PillButton
          disabled={posting}
          color="blue"
          invert
          onClick={async () => {
            setPosting(true)
            try {
              await postTweet({
                variables: { input: { id } },
              })
            } catch (e) {
              console.error(e)
              setPosting(false)
            }
          }}
        >
          <FontAwesomeIcon
            icon={posting ? faSpinner : faTwitter}
            spin={posting}
          />
          Post to Twitter
        </PillButton>
      )}
    </PostTweetComponent>
  )
}

type LoadMoreButtonProps = React.PropsWithoutRef<
  JSX.IntrinsicElements["button"]
> & {
  isLoading?: boolean
}
const LoadMoreButton = ({
  children,
  isLoading = false,
  ...props
}: LoadMoreButtonProps) => (
  <button type="button" {...props}>
    <FontAwesomeIcon
      icon={isLoading ? faSpinner : faAngleDoubleDown}
      spin={isLoading}
    />
    {children || "Show More…"}
    <style jsx>{`
      button {
        display: block;
        margin: 0 auto;
        padding: ${spacing(1)} ${spacing(3)};
        border: 0;
        background-color: ${colors.primary[500]};
        color: white;
        font-size: 1.2rem;
        font-weight: 500;
        border-radius: 0.5rem;
        box-shadow: ${shadow.md};
        outline: none;
      }
      button > :global(svg) {
        margin-right: ${spacing(2)};
      }
    `}</style>
  </button>
)
