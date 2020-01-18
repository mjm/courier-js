import React from "react"
import Link from "next/link"
import Head from "components/Head"
import withDefaultPage from "hocs/withDefaultPage"
import Router from "next/router"
import { NextPage } from "next"

const Home: NextPage<{}> = () => {
  return (
    <main>
      <Head title="Courier" />

      <section className="bg-white shadow-md mb-8 py-16">
        <div className="container mx-auto px-8">
          <h1 className="text-3xl font-medium mb-2 text-primary-10">
            Courier delivers your microblog to Twitter
          </h1>
          <h2 className="text-xl text-neutral-10 mt-4 mb-12 max-w-text">
            Post everything to your own blog, and let Courier deliver it to
            Twitter in a way that makes sense.
          </h2>

          <Link href="/login">
            <a className="btn btn-first btn-first-primary text-2xl font-medium py-3 px-5 rounded-lg">
              Get Started
            </a>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-8 mb-10 text-lg leading-relaxed">
        <div className="max-w-text mx-auto">
          You don’t have to leave Twitter behind to be able to own your content.
          Write all your posts, from shower thoughts to long-form essays, on
          your own site, and let Courier handle bringing it to Twitter.
        </div>
      </section>

      <section className="px-8 container mx-auto">
        <div className="flex flex-row flex-wrap -mx-4">
          <FeatureCard title="Translates your HTML into tweetable text">
            Courier understands what a tweet should look like and will format
            your posts in an intelligent way. Your tweets will look like you
            typed them by hand just for Twitter.
          </FeatureCard>
          <FeatureCard title="Edit your tweets before they go public">
            Optionally review drafts of your autogenerated tweets before they
            get posted. You can catch typos and translation mistakes before they
            go public, or decide you didn’t want to tweet that post after all.
          </FeatureCard>
          <FeatureCard title="Pull content from multiple feeds">
            Courier can watch many different feeds and post them all to the same
            Twitter account. You can set some feeds to post automatically after
            a short delay while having other feeds require your approval before
            posting.
          </FeatureCard>
        </div>
      </section>
    </main>
  )
}

Home.getInitialProps = async ({ res, ...ctx }) => {
  if (!(ctx as any).user) {
    return {}
  }

  if (res) {
    res.writeHead(302, { Location: "/tweets" })
    res.end()
  } else {
    Router.push("/tweets")
  }

  return {}
}

export default withDefaultPage(Home)

const FeatureCard = (props: { title: string; children: React.ReactNode }) => (
  <div className="w-full md:w-1/3 px-4 mb-8">
    <h3 className="text-lg leading-snug font-medium mb-2 text-primary-10">
      {props.title}
    </h3>
    <div className="leading-relaxed">{props.children}</div>
  </div>
)
