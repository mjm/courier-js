import React from "react"
import Head from "../components/head"
import Nav from "../components/nav"
import {
  AllFeedsComponent,
  FeedInput,
  AddFeedComponent,
  AllFeedsDocument,
  AllFeedsQuery,
} from "../lib/generated/graphql-components"
import withData from "../lib/apollo"
import { Formik, Form, Field, FormikActions, ErrorMessage } from "formik"
import * as yup from "yup"
import { isApolloError } from "apollo-client"

const Feeds = () => (
  <div>
    <Head title="Feeds to Watch" />
    <Nav />

    <div className="container">
      <h1>Feeds to Watch</h1>
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
    `}</style>
  </div>
)

const FeedsList = () => {
  return (
    <div>
      <AllFeedsComponent>
        {({ data, error }) => {
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
          padding: 1rem;
          border: 1px solid turquoise;
          border-radius: 0.5rem;
          margin-bottom: 0.75rem;
        }

        h3 {
          font-size: 1.2rem;
          margin: 0;
          margin-bottom: 0.6rem;
        }

        a {
          color: #222;
          text-decoration: none;
        }
      `}</style>
    </div>
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
              padding: 0.5rem;
              margin-bottom: 0.75rem;
            }

            button {
              font-size: 1.5rem;
              background-color: turquoise;
              border-color: transparent;
              border-radius: 0.5rem;
              color: #2a4e51;
              padding: 0.5rem 0.75rem;
            }
          `}</style>
        </div>
      )
    }}
  </AddFeedComponent>
)

export default withData(Feeds)
