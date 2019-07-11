import Container, { FlushContainer } from "../components/container"
import Head from "../components/head"
import { PageHeader } from "../components/header"
import { ContentCard } from "../components/card"
import Link from "next/link"
import withPublicPage from "../hocs/publicPage"
import { NextPage } from "next"

const Pricing: NextPage<{}> = () => {
  return (
    <Container>
      <Head title="Pricing" />

      <PageHeader>Pricing</PageHeader>
      <FlushContainer>
        <ContentCard mt={4}>
          <p>
            It’s easy to get started using Courier. You can sign in with your
            Twitter account at any time for free.
          </p>
          <p>
            Once you’re signed in, you can add your site’s feed and Courier will
            start watching for new posts. Right away, you’ll be able to see the
            tweets that Courier would post for you.
          </p>
          <p>
            Courier requires a paid subscription to post tweets to Twitter. You
            can subscribe from{" "}
            <Link href="/account">
              <a>the account page</a>
            </Link>{" "}
            for <strong>$5 per month</strong>.
          </p>
          <p>
            You can cancel your subscription at any time, and it will remain
            active for the remainder of the month.
          </p>
        </ContentCard>
      </FlushContainer>
    </Container>
  )
}

export default withPublicPage(Pricing)
