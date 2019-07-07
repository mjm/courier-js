import withDefaultPage from "../hocs/defaultPage"
import Container from "../components/container"
import Head from "../components/head"
import { PageHeader, PageDescription } from "../components/header"
import Card, { CardHeader } from "../components/card"
import { Heading } from "@rebass/emotion"

const Features = () => {
  return (
    <Container>
      <Head title="Features" />

      <PageHeader>What is Courier?</PageHeader>
      <PageDescription>
        Courier is your own personal Twitter bot.
      </PageDescription>
      <Card mt={4}>
        <CardHeader>Smart translation to Twitter-speak</CardHeader>
        <p>
          Every post you write on your blog will be run through Courier’s
          translator. The translator understands what kind of content makes
          sense and feels natural and Twitter, and make several transformations
          to help your autoposted tweets fit in with the rest of Twitter:
        </p>
        <ul>
          <li>Remove most HTML tags</li>
          <li>Pull out URLs from link tags</li>
          <li>Surround block quotes with quotation marks</li>
          <li>Attach embedded images</li>
          <li>Turn embedded tweets into a “retweet with comment”</li>
        </ul>
      </Card>
      <Card mt={3}>
        <CardHeader>Catch mistakes before they’re posted</CardHeader>
        <p>
          It’s important that your writing looks how you expect when it goes out
          to your followers. Courier has a few different ways to make sure that
          you say exactly what you mean.
        </p>
        <Heading fontSize={2} color="primary.800" fontWeight={500}>
          Review your tweets before they go out
        </Heading>
        <p>
          By default, Courier will hold back your posts from Twitter, so you
          have a chance to review exactly what will be sent to Twitter when
          Courier posts your tweet. With a single click, you can either send
          your tweet or reject it. If you choose to post your tweets
          automatically, you’ll still have a five minute delay where you can
          confirm or reject Courier’s action.
        </p>
        <Heading fontSize={2} color="primary.800" fontWeight={500}>
          Edit and make corrections
        </Heading>
        <p>
          You’re not stuck with the translation that Courier makes. If you
          notice something that isn’t quite how you want it, you can easily edit
          your post before it gets tweeted.
        </p>
      </Card>
      <Card mt={3}>
        <CardHeader>Mobile friendly</CardHeader>
        <p>Courier works great on both desktop and mobile.</p>
      </Card>
    </Container>
  )
}

export default withDefaultPage(Features)
