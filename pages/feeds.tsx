import React from "react"
import Head from "../components/head"
import Nav from "../components/nav"
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
import { colors, spacing, font } from "../utils/theme"

const Feeds = () => (
  <div>
    <Head title="Feeds to Watch" />
    <Nav />

    <div className="container">
      <PageHeader>Feeds to Watch</PageHeader>
      <p>
        The feeds you add here will be checked for new posts that need to be
        tweeted.
      </p>
      <FeedsList />
      <AddFeed />
    </div>
    <style jsx>{`
      .container {
        padding: 0 1rem;
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
          const { allFeeds: feeds } = data
          return (
            <ul>
              {feeds.map(feed => (
                <li key={feed.id}>
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
                    <DeleteButton feed={feed} />
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
  feed: {
    id: string
  }
}

const DeleteButton = ({ feed }: DeleteButtonProps) => {
  return (
    <DeleteFeedComponent
      update={(cache, { data }) => {
        if (!data) {
          return
        }

        const { deleteFeed } = data
        const { allFeeds } = cache.readQuery<AllFeedsQuery>({
          query: AllFeedsDocument,
        })!
        const newFeeds = allFeeds.filter(f => f.id !== deleteFeed)
        cache.writeQuery<AllFeedsQuery>({
          query: AllFeedsDocument,
          data: { allFeeds: newFeeds },
        })
      }}
    >
      {deleteFeed => (
        <Button
          type="button"
          onClick={() => {
            deleteFeed({
              variables: { id: feed.id },
              optimisticResponse: {
                __typename: "Mutation",
                deleteFeed: feed.id,
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
      if (!data) {
        return
      }

      const { allFeeds } = cache.readQuery<AllFeedsQuery>({
        query: AllFeedsDocument,
      })!
      cache.writeQuery<AllFeedsQuery>({
        query: AllFeedsDocument,
        data: {
          allFeeds: allFeeds.concat([data.addFeed]),
        },
      })
    }}
  >
    {addFeed => {
      const onSubmit = async (
        feed: FeedInput,
        actions: FormikActions<FeedInput>
      ) => {
        try {
          const result = await addFeed({ variables: { feed } })
          console.log(result)
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
            }
          `}</style>
        </div>
      )
    }}
  </AddFeedComponent>
)

export default withSecurePage(withData(Feeds))
