import React, { useState } from "react"
import Head from "../components/head"
import { PageHeader } from "../components/header"
import {
  AllFeedsComponent,
  AddFeedComponent,
  AllFeedsDocument,
  AllFeedsQuery,
  RefreshFeedComponent,
  DeleteFeedComponent,
  AddFeedInput,
  UpcomingTweetsDocument,
} from "../lib/generated/graphql-components"
import withData from "../hocs/apollo"
import { Formik, Form, Field, FormikActions, ErrorMessage } from "formik"
import * as yup from "yup"
import withSecurePage from "../hocs/securePage"
import { colors, spacing, font, shadow } from "../utils/theme"
import { DataProxy } from "apollo-cache"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faRss,
  faHistory,
  faSyncAlt,
  faTrashAlt,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons"
import Moment from "react-moment"
import Loading from "../components/loading"
import { PillButton } from "../components/button"
import { ErrorBox, FieldError } from "../components/error"
import Container from "../components/container"

const Feeds = () => (
  <Container>
    <Head title="Feeds to Watch" />

    <PageHeader>Feeds to Watch</PageHeader>
    <p>
      The feeds you add here will be checked for new posts that need to be
      tweeted.
    </p>
    <FeedsList />
    <AddFeed />
    <style jsx>{`
      p {
        color: ${colors.primary[900]};
        text-align: center;
        margin-bottom: 2em;
      }
    `}</style>
  </Container>
)

const FeedsList = () => {
  const [actionError, setActionError] = useState<Error | undefined>()

  return (
    <div>
      <AllFeedsComponent>
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
          const nodes = data.allSubscribedFeeds.nodes
          return (
            <>
              <ErrorBox error={actionError} />
              <ul>
                {nodes.map(({ id, feed }) => (
                  <li key={id}>
                    <h3>
                      <a href={feed.homePageURL}>{feed.title}</a>
                    </h3>
                    <a href={feed.homePageURL}>
                      <FontAwesomeIcon icon={faHome} fixedWidth />
                      <span className="url">{feed.homePageURL}</span>
                    </a>
                    <a href={feed.url}>
                      <FontAwesomeIcon icon={faRss} fixedWidth />
                      <span className="url">{feed.url}</span>
                    </a>
                    {feed.refreshedAt && (
                      <div>
                        <FontAwesomeIcon icon={faHistory} fixedWidth />
                        <span>
                          Checked <Moment fromNow>{feed.refreshedAt}</Moment>
                        </span>
                      </div>
                    )}
                    <div className="buttons">
                      <RefreshButton feed={feed} setError={setActionError} />
                      <DeleteButton id={id} setError={setActionError} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )
        }}
      </AllFeedsComponent>
      <style jsx>{`
        ul {
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }
        li {
          padding: ${spacing(3)} ${spacing(4)};
          background-color: white;
          border-top: 3px solid ${colors.primary[500]};
          margin-bottom: ${spacing(4)};
          box-shadow: ${shadow.md};
        }
        li > * {
          line-height: 1.375em;
          display: flex;
          align-items: center;
        }
        .url {
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
        }
        h3 {
          font-family: ${font.display};
          font-size: 1.2rem;
          font-weight: 500;
          margin: 0;
          margin-bottom: ${spacing(2)};
        }
        * > :global(svg) {
          color: ${colors.primary[700]};
          margin-right: ${spacing(2)};
        }
        a {
          color: ${colors.primary[800]};
          text-decoration: none;
        }
        .buttons {
          margin-top: ${spacing(2)};
        }
      `}</style>
    </div>
  )
}

interface RefreshButtonProps {
  feed: {
    id: string
  }
  setError: (err: Error | undefined) => void
}

const RefreshButton = ({ feed, setError }: RefreshButtonProps) => {
  const [refreshing, setRefreshing] = useState(false)

  return (
    <RefreshFeedComponent refetchQueries={[{ query: UpcomingTweetsDocument }]}>
      {refreshFeed => (
        <PillButton
          disabled={refreshing}
          onClick={async () => {
            setRefreshing(true)
            try {
              await refreshFeed({ variables: { input: { id: feed.id } } })
              setError(undefined)
            } catch (err) {
              setError(err)
            } finally {
              setRefreshing(false)
            }
          }}
        >
          <FontAwesomeIcon icon={faSyncAlt} spin={refreshing} />
          Refresh
        </PillButton>
      )}
    </RefreshFeedComponent>
  )
}

interface DeleteButtonProps {
  id: string
  setError: (err: Error | undefined) => void
}

const DeleteButton = ({ id, setError }: DeleteButtonProps) => {
  return (
    <DeleteFeedComponent
      update={(cache, { data }) => {
        data &&
          updateCachedFeeds(cache, nodes =>
            nodes.filter(f => f.id !== data.deleteFeed.id)
          )
      }}
    >
      {deleteFeed => (
        <PillButton
          onClick={async () => {
            try {
              await deleteFeed({
                variables: { input: { id } },
                optimisticResponse: {
                  __typename: "Mutation",
                  deleteFeed: {
                    __typename: "DeleteFeedPayload",
                    id,
                  },
                },
              })
              setError(undefined)
            } catch (err) {
              setError(err)
            }
          }}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
          Delete
        </PillButton>
      )}
    </DeleteFeedComponent>
  )
}

const newFeedSchema = yup.object().shape({
  url: yup.string().url("This must be a valid URL."),
})
const initialNewFeed: AddFeedInput = { url: "" }

const AddFeed = () => (
  <AddFeedComponent
    update={(cache, { data }) => {
      data && updateCachedFeeds(cache, nodes => [...nodes, data.addFeed.feed])
    }}
    refetchQueries={[{ query: UpcomingTweetsDocument }]}
  >
    {addFeed => {
      const onSubmit = async (
        input: AddFeedInput,
        actions: FormikActions<AddFeedInput>
      ) => {
        try {
          await addFeed({ variables: { input } })
          actions.resetForm()
        } catch (error) {
          actions.setStatus({ error })
        } finally {
          actions.setSubmitting(false)
        }
      }

      return (
        <div>
          <Formik
            initialValues={initialNewFeed}
            initialStatus={{ error: null }}
            validationSchema={newFeedSchema}
            onSubmit={onSubmit}
            render={({ isSubmitting, status: { error } }) => (
              <Form>
                <ErrorBox error={error} />
                <div className="container">
                  <div className="field">
                    <Field type="text" name="url" placeholder="https://" />
                    <ErrorMessage name="url" component={FieldError} />
                  </div>
                  <button type="submit" disabled={isSubmitting}>
                    <FontAwesomeIcon
                      icon={isSubmitting ? faSyncAlt : faPlusCircle}
                      spin={isSubmitting}
                    />
                    Add Feed
                  </button>
                </div>
              </Form>
            )}
          />
          <style jsx>{`
            div > :global(form) {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .container {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
            }
            .field {
              flex-grow: 1;
              width: 100%;
              margin-bottom: ${spacing(2)};
            }
            @media (min-width: 500px) {
              .container {
                flex-wrap: nowrap;
              }
              .field {
                padding-right: ${spacing(3)};
                margin-bottom: 0;
              }
              button {
                padding-top: 0;
                padding-bottom: 0;
              }
            }
            div :global(input) {
              width: 100%;
              font-size: 1.5rem;
              padding: ${spacing(2)} ${spacing(4)};
              background-color: ${colors.gray[100]};
              border: 0;
              border-bottom: 3px solid ${colors.primary[500]};
              color: ${colors.primary[700]};
              box-shadow: ${shadow.sm};
            }
            div :global(input):focus {
              outline: none;
            }
            div :global(input)::placeholder {
              color: ${colors.gray[400]};
            }
            button {
              flex-shrink: 0;
              font-size: 1.4rem;
              font-weight: 500;
              background-color: ${colors.primary[500]};
              border-color: transparent;
              border-radius: 0.5rem;
              color: white;
              padding: ${spacing(2)} ${spacing(4)};
              box-shadow: ${shadow.sm};
            }
            button > :global(svg) {
              margin-right: ${spacing(2)};
            }
          `}</style>
        </div>
      )
    }}
  </AddFeedComponent>
)

type Nodes = AllFeedsQuery["allSubscribedFeeds"]["nodes"]

function updateCachedFeeds(
  cache: DataProxy,
  updateFn: (nodes: Nodes) => Nodes
) {
  const { allSubscribedFeeds } = cache.readQuery<AllFeedsQuery>({
    query: AllFeedsDocument,
  })!
  const newNodes = updateFn(allSubscribedFeeds.nodes)
  cache.writeQuery<AllFeedsQuery>({
    query: AllFeedsDocument,
    data: {
      allSubscribedFeeds: {
        __typename: "SubscribedFeedConnection",
        nodes: newNodes,
        pageInfo: allSubscribedFeeds.pageInfo,
      },
    },
  })
}

export default withSecurePage(withData(Feeds))
