import withPublicPage from "../hocs/withPublicPage"
import Container, { FlushContainer } from "../components/Container"
import Head from "../components/Head"
import { ContentCard, CardHeader } from "../components/Card"
import { NextPage } from "next"
import PageHeader from "../components/PageHeader"

const FAQ: NextPage<{}> = () => {
  return (
    <Container>
      <Head title="Frequently Asked Questions" />

      <PageHeader>FAQ</PageHeader>
      <FlushContainer>
        <ContentCard mt={4}>
          <CardHeader>Why did you make Courier?</CardHeader>
          <p>
            I really like microblogging: in particular, I like posting my
            content to my own site that I can control and own forever. I also
            enjoy engaging with the Twitter community, so I value being able to
            continue posting my thoughts and writing there.
          </p>
          <p>
            When I first started microblogging, I tried a number of tools and
            plugins to crosspost from my blog to Twitter. Every single one of
            them produced tweets that felt unnatural and artificial: they didn’t
            really fit in with the way people write for Twitter.
          </p>
          <p>
            I wanted a tool that would let me keep posting to my own site while
            posting tweets that felt like they were actually written for
            Twitter. Courier is that tool.
          </p>
        </ContentCard>
        <ContentCard mt={3}>
          <CardHeader>
            My tweets aren’t showing up in Courier as quickly as I’d expect
          </CardHeader>
          <p>
            Courier will periodically check the feeds that it knows about for
            new posts, but the quickest way to get posts from your blog to
            Courier is to set up your blog to ping Courier when you make
            changes.
          </p>
          <p>
            Many blogging CMSes have a setting where you can add URLs to ping
            when you’ve updated you blog. If you use WordPress, you can find
            this in the admin section of your site under{" "}
            <strong>Settings → Writing → Update Services</strong>.
          </p>
          <p>
            If your blog supports this feature, add the URL{" "}
            <code>https://courier.blog/ping</code> to the list.
          </p>
          <p>
            When your blog pings Courier, it will immediately check the feed for
            new posts and create draft tweets for them.
          </p>
        </ContentCard>
      </FlushContainer>
    </Container>
  )
}

export default withPublicPage(FAQ)
