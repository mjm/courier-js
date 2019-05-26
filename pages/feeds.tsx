import React from "react"
import Head from "../components/head"
import { PageHeader, PageDescription } from "../components/header"
import {
  AllFeedsComponent,
  AddFeedComponent,
  AllFeedsDocument,
  AllFeedsQuery,
  AddFeedInput,
  UpcomingTweetsDocument,
} from "../lib/generated/graphql-components"
import withData from "../hocs/apollo"
import { Formik, Form, Field, FormikActions, ErrorMessage } from "formik"
import * as yup from "yup"
import withSecurePage from "../hocs/securePage"
import { colors, spacing, shadow } from "../utils/theme"
import { DataProxy } from "apollo-cache"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faHistory,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons"
import Moment from "react-moment"
import Loading from "../components/loading"
import { Button } from "../components/button"
import { ErrorBox, FieldError } from "../components/error"
import Container from "../components/container"
import Link from "next/link"
import Box, { BoxHeader } from "../components/box"
import orderBy from "lodash/orderBy"

const Feeds = () => (
  <Container>
    <Head title="Feeds to Watch" />

    <PageHeader>Feeds to Watch</PageHeader>
    <PageDescription>
      The feeds you add here will be checked for new posts that need to be
      tweeted.
    </PageDescription>
    <FeedsList />
    <AddFeed />
  </Container>
)

const FeedsList = () => {
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
            <ul>
              {nodes.map(({ id, feed }) => (
                <li key={id}>
                  <Box>
                    <BoxHeader>
                      <Link href={`/feed?id=${id}`} as={`/feeds/${id}`}>
                        <a>{feed.title}</a>
                      </Link>
                    </BoxHeader>
                    <a className="row" href={feed.homePageURL}>
                      <FontAwesomeIcon icon={faHome} fixedWidth />
                      <span className="url">{feed.homePageURL}</span>
                    </a>
                    {feed.refreshedAt && (
                      <div className="row">
                        <FontAwesomeIcon icon={faHistory} fixedWidth />
                        <span>
                          Checked <Moment fromNow>{feed.refreshedAt}</Moment>
                        </span>
                      </div>
                    )}
                  </Box>
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
        .row {
          line-height: 1.5em;
          display: flex;
          align-items: center;
        }
        .url {
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
        }
        * > :global(svg) {
          color: ${colors.primary[700]};
          margin-right: ${spacing(2)};
        }
        a {
          text-decoration: none;
        }
      `}</style>
    </div>
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
                  <Button
                    size="large"
                    type="submit"
                    icon={faPlusCircle}
                    spin={isSubmitting}
                  >
                    Add Feed
                  </Button>
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
                margin-right: -0.5rem;
              }
              .field {
                padding-right: ${spacing(3)};
                margin-bottom: 0;
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
  const newNodes = orderBy(updateFn(allSubscribedFeeds.nodes), "feed.url")
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
