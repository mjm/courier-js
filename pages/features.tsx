import withPublicPage from "../hocs/publicPage"
import Container, { FlushContainer } from "../components/container"
import Head from "../components/head"
import { PageHeader, PageDescription } from "../components/header"
import { CardHeader, ContentCard } from "../components/card"
import { NextPage } from "next"

const Features: NextPage<{}> = () => {
  return (
    <Container>
      <Head title="Features" />

      <PageHeader>What is Courier?</PageHeader>
      <PageDescription>
        Courier is your own personal Twitter bot.
      </PageDescription>
      <FlushContainer>
        <ContentCard mt={4}>
          <CardHeader>Smart translation to Twitter-speak</CardHeader>
          <p>
            Every post you write on your blog will be run through Courier’s
            translator. The translator understands what kind of content makes
            sense and feels natural and Twitter, and make several
            transformations to help your autoposted tweets fit in with the rest
            of Twitter:
          </p>
          <ul>
            <li>Remove most HTML tags</li>
            <li>Pull out URLs from link tags</li>
            <li>Surround block quotes with quotation marks</li>
            <li>Attach embedded images</li>
            <li>Turn embedded tweets into a “retweet with comment”</li>
          </ul>
        </ContentCard>
        <ContentCard mt={3}>
          <CardHeader>Catch mistakes before they’re posted</CardHeader>
          <p>
            It’s important that your writing looks how you expect when it goes
            out to your followers. Courier has a few different ways to make sure
            that you say exactly what you mean.
          </p>
          <h2>Review your tweets before they go out</h2>
          <p>
            By default, Courier will hold back your posts from Twitter, so you
            have a chance to review exactly what will be sent to Twitter when
            Courier posts your tweet. With a single click, you can either send
            your tweet or reject it. If you choose to post your tweets
            automatically, you’ll still have a five minute delay where you can
            confirm or reject Courier’s action.
          </p>
          <h2>Edit and make corrections</h2>
          <p>
            You’re not stuck with the translation that Courier makes. If you
            notice something that isn’t quite how you want it, you can easily
            edit your post before it gets tweeted.
          </p>
        </ContentCard>
        <ContentCard mt={3}>
          <CardHeader>Mobile friendly</CardHeader>
          <p>Courier works great on both desktop and mobile.</p>
        </ContentCard>
      </FlushContainer>
    </Container>
  )
}

export default withPublicPage(Features)
