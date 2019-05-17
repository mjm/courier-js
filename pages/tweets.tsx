import React, { useState } from "react"
import Head from "../components/head"
import { PageHeader } from "../components/header"
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
import { spacing, shadow, colors, font } from "../utils/theme"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAngleDoubleDown,
  faBan,
  faUndoAlt,
  faSpinner,
  faEdit,
  faCheck,
  faShare,
} from "@fortawesome/free-solid-svg-icons"
import Loading from "../components/loading"
import { PillButton } from "../components/button"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import Moment from "react-moment"
import { ErrorBox } from "../components/error"
import { Formik, Form, Field } from "formik"
import Linkify from "react-linkify"
import Container from "../components/container"

const Tweets = () => (
  <Container>
    <Head title="Your Tweets" />

    <PageHeader>Your Tweets</PageHeader>
    <p>These are the tweets Courier has translated from your feeds.</p>
    <h2>Upcoming Tweets</h2>
    <TweetsList query={UpcomingTweetsComponent} />
    <h2>Past Tweets</h2>
    <TweetsList query={PastTweetsComponent} />
    <style jsx>{`
      p {
        text-align: center;
      }
      h2 {
        font-family: ${font.display};
        color: ${colors.primary[900]};
        letter-spacing: -0.025em;
      }
    `}</style>
  </Container>
)

export default withSecurePage(withData(Tweets))

interface TweetsListProps {
  // this type should match both upcoming and past.
  // we just had to pick one to use to grab the type
  query: typeof UpcomingTweetsComponent
}
const TweetsList = ({ query: QueryComponent }: TweetsListProps) => {
  return (
    <div>
      <QueryComponent>
        {({ data, error, loading, fetchMore }) => {
          if (loading) {
            return <Loading />
          }

          if (error) {
            return <ErrorBox error={error} />
          }

          if (!data) {
            return null
          }

          const loadMore = () => {
            fetchMore({
              variables: {
                cursor: pageInfo.endCursor,
              },
              updateQuery(previousResult, { fetchMoreResult }) {
                if (!fetchMoreResult) {
                  return previousResult
                }
                const oldNodes = previousResult.allTweets.nodes
                const { nodes: newNodes, pageInfo } = fetchMoreResult.allTweets

                return {
                  allTweets: {
                    __typename: "TweetConnection",
                    nodes: [...oldNodes, ...newNodes],
                    pageInfo,
                  },
                }
              },
            })
          }

          const { nodes, pageInfo } = data.allTweets
          return (
            <ul>
              {nodes.map(tweet => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
              {pageInfo.hasPreviousPage && (
                <li>
                  <LoadMoreButton onClick={loadMore} />
                </li>
              )}
            </ul>
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
}

const TweetCard = ({ tweet }: TweetCardProps) => {
  const [editing, setEditing] = useState(false)

  return (
    <li className={`${tweet.status.toLowerCase()}`}>
      {editing ? (
        <EditTweetCard tweet={tweet} onStopEditing={() => setEditing(false)} />
      ) : (
        <ViewTweetCard tweet={tweet} onEdit={() => setEditing(true)} />
      )}
      <style jsx>{`
        li {
          background-color: white;
          padding: ${spacing(4)};
          box-shadow: ${shadow.md};
          margin-bottom: ${spacing(4)};
          border-top: 3px solid ${colors.primary[500]};
        }
        li.canceled {
          background-color: ${colors.gray[200]};
          border-top-color: ${colors.gray[400]};
        }
        li :global(.buttons) {
          margin-top: ${spacing(4)};
        }
      `}</style>
    </li>
  )
}

interface ViewTweetCardProps {
  tweet: AllTweetsFieldsFragment
  onEdit: () => void
}

const ViewTweetCard = ({ tweet, onEdit }: ViewTweetCardProps) => {
  return (
    <div>
      <div className="body">
        <Linkify>{tweet.body}</Linkify>
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
      <div className="buttons">
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
          <span className="status">
            canceled. <UncancelButton id={tweet.id} />
          </span>
        )}
        {tweet.status === TweetStatus.Posted && (
          <span className="status">
            <a
              href={`https://twitter.com/user/status/${tweet.postedTweetID}`}
              target="_blank"
            >
              tweeted <Moment fromNow>{tweet.postedAt}</Moment>
            </a>
          </span>
        )}
      </div>
      <style jsx>{`
        .body {
          white-space: pre-wrap;
        }
        a,
        .body :global(a),
        .status :global(a) {
          color: ${colors.primary[700]};
        }
        .media {
          margin-top: ${spacing(3)};
          display: flex;
        }
        figure {
          margin: 0;
          padding: 0 ${spacing(1)};
          width: 25%;
        }
        img {
          width: 100%;
          border-radius: 1rem;
        }
        span.status {
          font-size: 0.9rem;
          font-style: italic;
          color: ${colors.gray[600]};
        }
      `}</style>
    </div>
  )
}

interface EditTweetCardProps {
  tweet: AllTweetsFieldsFragment
  onStopEditing: () => void
}

type FormValues = Pick<AllTweetsFieldsFragment, "body"> & {
  action: "save" | "post"
}

const EditTweetCard = ({ tweet, onStopEditing }: EditTweetCardProps) => {
  const initialValues: FormValues = { body: tweet.body, action: "save" }
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
                onSubmit={async ({ body, action }, actions) => {
                  const input = { id: tweet.id, body: body }
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

                  return (
                    <Form>
                      <ErrorBox error={status.error} />
                      <Field name="body" component="textarea" autoFocus />
                      <div className="buttons">
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
                      </div>
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
          outline: none;
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
>
const LoadMoreButton = ({ children, ...props }: LoadMoreButtonProps) => (
  <button type="button" {...props}>
    <FontAwesomeIcon icon={faAngleDoubleDown} />
    {children || "Load More…"}
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
      }
      button > :global(svg) {
        margin-right: ${spacing(1)};
      }
    `}</style>
  </button>
)
