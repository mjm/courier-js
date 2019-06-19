import React from "react"
import styled from "@emotion/styled"
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
import {
  faHome,
  faHistory,
  faPlusCircle,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons"
import Moment from "react-moment"
import Loading from "../components/loading"
import { Button } from "../components/button"
import { ErrorBox, FieldError } from "../components/error"
import Container from "../components/container"
import Link from "next/link"
import orderBy from "lodash/orderBy"
import Card, { CardHeader } from "../components/card"
import Group from "../components/group"
import Icon from "../components/icon"

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

const InfoRow = styled.div(({ theme }: any) => ({
  lineHeight: theme.lineHeights.normal,
  display: "flex",
  alignItems: "center",
}))
const InfoLink = InfoRow.withComponent("a")

const URL = styled.span`
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
`

type InfoIconProps = { icon: IconDefinition }
const InfoIcon = ({ icon }: InfoIconProps) => (
  <Icon icon={icon} fixedWidth mr={2} color="primary.700" />
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
            <Group direction="column" spacing={3} mb={3}>
              {nodes.map(({ id, feed }) => (
                <Card key={id} css={{ a: { textDecoration: "none" } }}>
                  <CardHeader>
                    <Link href={`/feed?id=${id}`} as={`/feeds/${id}`}>
                      <a>{feed.title}</a>
                    </Link>
                  </CardHeader>
                  <InfoLink href={feed.homePageURL}>
                    <InfoIcon icon={faHome} />
                    <URL>{feed.homePageURL}</URL>
                  </InfoLink>
                  {feed.refreshedAt && (
                    <InfoRow>
                      <InfoIcon icon={faHistory} />
                      <span>
                        Checked <Moment fromNow>{feed.refreshedAt}</Moment>
                      </span>
                    </InfoRow>
                  )}
                </Card>
              ))}
            </Group>
          )
        }}
      </AllFeedsComponent>
    </div>
  )
}

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 500px) {
    flex-wrap: nowrap;
    margin-right: -0.5rem;
  }
`

const FormField = styled.div`
  flex-grow: 1;
  width: 100%;
  margin-bottom: ${spacing(2)};

  @media (min-width: 500px) {
    padding-right: ${spacing(3)};
    margin-bottom: 0;
  }
`

const URLField = styled(Field)`
  width: 100%;
  font-size: 1.5rem;
  padding: ${spacing(2)} ${spacing(4)};
  background-color: ${colors.gray[100]};
  border: 0;
  border-bottom: 3px solid ${colors.primary[500]};
  color: ${colors.primary[700]};
  box-shadow: ${shadow.sm};

  :focus {
    outline: none;
  }

  ::placeholder {
    color: ${colors.gray[400]};
  }
`

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
        <Formik
          initialValues={initialNewFeed}
          initialStatus={{ error: null }}
          validationSchema={newFeedSchema}
          onSubmit={onSubmit}
          render={({ isSubmitting, status: { error } }) => (
            <Form>
              <ErrorBox error={error} />
              <FormContainer>
                <FormField>
                  <URLField type="text" name="url" placeholder="https://" />
                  <ErrorMessage name="url" component={FieldError} />
                </FormField>
                <Button
                  size="large"
                  type="submit"
                  icon={faPlusCircle}
                  spin={isSubmitting}
                >
                  Add Feed
                </Button>
              </FormContainer>
            </Form>
          )}
        />
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
