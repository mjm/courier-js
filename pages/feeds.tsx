import React from "react"
import Head from "../components/head"
import { PageHeader } from "../components/header"
import {
  AllFeedsComponent,
  FeedInput,
  AddFeedComponent,
  AllFeedsDocument,
  AllFeedsQuery,
  RefreshFeedComponent,
  DeleteFeedComponent,
} from "../lib/generated/graphql-components"
import withData from "../lib/apollo"
import { Formik, Form, Field, FormikActions, ErrorMessage } from "formik"
import * as yup from "yup"
import { isApolloError } from "apollo-client"
import moment from "moment"
import withSecurePage from "../hocs/securePage"
import { colors, spacing, font, shadow } from "../utils/theme"
import { DataProxy } from "apollo-cache"

const Feeds = () => (
  <div className="container">
    <Head title="Feeds to Watch" />

    <PageHeader>Feeds to Watch</PageHeader>
    <p>
      The feeds you add here will be checked for new posts that need to be
      tweeted.
    </p>
    <FeedsList />
    <AddFeed />
    <style jsx>{`
      .container {
        padding: 0 1rem 6rem 1rem;
      }

      .container > p {
        text-align: center;
      }
    `}</style>
  </div>
)

const FeedsList = () => {
  return (
    <div>
      <AllFeedsComponent>
        {({ data, error, loading }) => {
          if (loading) {
            return <p>Loading...</p>
          }

          if (error) {
            return <p>{error.message}</p>
          }

          if (!data) {
            return null
          }
          const nodes = data.allSubscribedFeeds.nodes
          return (
            <ul>
              {nodes.map(({ id, feed }) => (
                <li key={id}>
                  <h3>
                    <a href={feed.homePageURL}>{feed.title}</a>
                  </h3>
                  <div>
                    Home: <a href={feed.homePageURL}>{feed.homePageURL}</a>
                  </div>
                  <div>
                    Feed: <a href={feed.url}>{feed.url}</a>
                  </div>
                  {feed.refreshedAt && (
                    <div>
                      Refreshed at: {moment.utc(feed.refreshedAt).format("lll")}
                    </div>
                  )}
                  <div className="buttons">
                    <RefreshButton feed={feed} />
                    <DeleteButton id={id} />
                  </div>
                </li>
              ))}
            </ul>
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
          background-color: ${colors.gray[100]};
          border-top: 3px solid ${colors.primary[500]};
          margin-bottom: ${spacing(4)};
          box-shadow: ${shadow.md};
        }

        li div {
          line-height: 1.375em;
        }

        h3 {
          font-family: ${font.display};
          font-size: 1.2rem;
          font-weight: 500;
          margin: 0;
          margin-bottom: ${spacing(2)};
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

const Button = ({ children, ...props }: any) => {
  return (
    <button {...props}>
      {children}
      <style jsx>{`
        button {
          background-color: ${colors.primary[600]};
          color: white;
          border: 0;
          padding: ${spacing(1)} ${spacing(3)};
          line-height: 1.5em;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 0.6rem;
          margin-right: ${spacing(2)};
        }

        button:hover {
          background-color: ${colors.primary[500]};
        }
      `}</style>
    </button>
  )
}

interface RefreshButtonProps {
  feed: {
    id: string
  }
}

const RefreshButton = ({ feed }: RefreshButtonProps) => {
  return (
    <RefreshFeedComponent>
      {refreshFeed => (
        <Button
          type="button"
          onClick={() => {
            refreshFeed({ variables: { id: feed.id } })
          }}
        >
          Refresh
        </Button>
      )}
    </RefreshFeedComponent>
  )
}

interface DeleteButtonProps {
  id: string
}

const DeleteButton = ({ id }: DeleteButtonProps) => {
  return (
    <DeleteFeedComponent
      update={(cache, { data }) => {
        data &&
          updateCachedFeeds(cache, nodes =>
            nodes.filter(f => f.id !== data.deleteFeed)
          )
      }}
    >
      {deleteFeed => (
        <Button
          type="button"
          onClick={() => {
            deleteFeed({
              variables: { id: id },
              optimisticResponse: {
                __typename: "Mutation",
                deleteFeed: id,
              },
            })
          }}
        >
          Delete
        </Button>
      )}
    </DeleteFeedComponent>
  )
}

const newFeedSchema = yup.object().shape({
  url: yup.string().url(),
})
const initialNewFeed: FeedInput = { url: "" }

const AddFeed = () => (
  <AddFeedComponent
    update={(cache, { data }) => {
      data && updateCachedFeeds(cache, nodes => [...nodes, data.addFeed])
    }}
  >
    {addFeed => {
      const onSubmit = async (
        feed: FeedInput,
        actions: FormikActions<FeedInput>
      ) => {
        try {
          await addFeed({ variables: { feed } })
          actions.resetForm(initialNewFeed)
        } catch (e) {
          // figure out something smart to do with these
          if (isApolloError(e)) {
            console.log(e.graphQLErrors)
          } else {
            console.error(e)
          }
        } finally {
          actions.setSubmitting(false)
        }
      }

      return (
        <div>
          <Formik
            initialValues={initialNewFeed}
            validationSchema={newFeedSchema}
            onSubmit={onSubmit}
            render={({ isSubmitting }) => (
              <Form>
                <Field type="text" name="url" placeholder="https://" />
                <ErrorMessage name="url" component="div" />
                <button type="submit" disabled={isSubmitting}>
                  Add Feed
                </button>
              </Form>
            )}
          />
          <style jsx>{`
            div > :global(form) {
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            div :global(input) {
              font-size: 1.5rem;
              width: 50%;
              min-width: 300px;
              padding: ${spacing(2)} ${spacing(4)};
              margin-bottom: ${spacing(3)};
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

            @media (max-width: 300px) {
              div :global(input) {
                min-width: 0;
                width: 100%;
              }
            }

            button {
              font-size: 1.4rem;
              font-weight: 500;
              background-color: ${colors.primary[500]};
              border-color: transparent;
              border-radius: 0.5rem;
              color: white;
              padding: ${spacing(2)} ${spacing(5)};
              box-shadow: ${shadow.sm};
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
