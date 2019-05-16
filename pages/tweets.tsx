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

const Tweets = () => (
  <div className="container">
    <Head title="Your Tweets" />

    <PageHeader>Your Tweets</PageHeader>
    <p>These are the tweets Courier has translated from your feeds.</p>
    <h2>Upcoming Tweets</h2>
    <TweetsList query={UpcomingTweetsComponent} />
    <h2>Past Tweets</h2>
    <TweetsList query={PastTweetsComponent} />
    <style jsx>{`
      .container {
        padding: 0 1rem 6rem 1rem;
      }
      .container > p {
        text-align: center;
      }
      h2 {
        font-family: ${font.display};
        color: ${colors.primary[900]};
        letter-spacing: -0.025em;
      }
    `}</style>
  </div>
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
          margin-top: ${spacing(3)};
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
      <div className="body">{tweet.body}</div>
      {tweet.mediaURLs.map(url => (
        <figure key={url}>
          <img src={url} style={{ width: "300px" }} />
        </figure>
      ))}
      <div className="buttons">
        {tweet.status === TweetStatus.Draft && (
          <>
            <CancelButton id={tweet.id} />
            <PostButton id={tweet.id} />
            <PillButton onClick={onEdit}>
              <FontAwesomeIcon icon={faEdit} />
              Edit Tweet
            </PillButton>
          </>
        )}
        {tweet.status === TweetStatus.Canceled && (
          <>
            Canceled. <UncancelButton id={tweet.id} />
          </>
        )}
        {tweet.status === TweetStatus.Posted && (
          <>
            Posted to Twitter{" "}
            <a
              href={`https://twitter.com/user/status/${tweet.postedTweetID}`}
              target="_blank"
            >
              <Moment fromNow>{tweet.postedAt}</Moment>
            </a>
          </>
        )}
      </div>
      <style jsx>{`
        .body {
          white-space: pre-wrap;
        }
        a {
          color: ${colors.primary[700]};
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
      <Formik
        initialValues={initialValues}
        isInitialValid
        onSubmit={(values, actions) => {
          console.log(values)
          actions.setSubmitting(false)
          onStopEditing()
        }}
      >
        {({ isSubmitting, setFieldValue, submitForm }) => {
          function submit(action: FormValues["action"]) {
            setFieldValue("action", action)
            // allow the previous line to rerender the component before doing this
            setTimeout(() => submitForm(), 0)
          }

          return (
            <Form>
              <Field name="body" component="textarea" />
              <div className="buttons">
                <PillButton disabled={isSubmitting} onClick={onStopEditing}>
                  <FontAwesomeIcon icon={faBan} />
                  Discard Changes
                </PillButton>
                <PillButton
                  disabled={isSubmitting}
                  onClick={() => submit("save")}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  Save Draft
                </PillButton>
                <PillButton
                  disabled={isSubmitting}
                  onClick={() => submit("post")}
                >
                  <FontAwesomeIcon icon={faShare} />
                  Post Now
                </PillButton>
              </div>
            </Form>
          )
        }}
      </Formik>
      <style jsx>{`
        div :global(textarea) {
          width: 100%;
          height: ${spacing(20)};
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
          onClick={() => {
            cancelTweet({
              variables: { id },
              optimisticResponse: {
                __typename: "Mutation",
                cancelTweet: {
                  __typename: "Tweet",
                  id,
                  status: TweetStatus.Canceled,
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
        <PillButton
          onClick={() => {
            uncancelTweet({
              variables: { id },
              optimisticResponse: {
                __typename: "Mutation",
                uncancelTweet: {
                  __typename: "Tweet",
                  id,
                  status: TweetStatus.Draft,
                },
              },
            })
          }}
        >
          <FontAwesomeIcon icon={faUndoAlt} />
          Undo
        </PillButton>
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
          onClick={async () => {
            setPosting(true)
            try {
              await postTweet({
                variables: { id },
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
