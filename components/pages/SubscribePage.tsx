import React from "react"
import { graphql } from "react-relay"
import { Elements, StripeProvider } from "react-stripe-elements"

import { NextPage } from "next"

import { faCheckCircle, faCreditCard } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { SubscribePageQueryResponse } from "@generated/SubscribePageQuery.graphql"
import Head from "components/Head"
import SubscribeForm from "components/SubscribeForm"
import withData from "hocs/withData"
import withSecurePage from "hocs/withSecurePage"

const SubscribePage: NextPage<SubscribePageQueryResponse> = ({
  currentUser,
}) => {
  const [stripe, setStripe] = React.useState<stripe.Stripe | null>(null)
  React.useEffect(() => {
    if (!process.env.STRIPE_KEY) {
      throw new Error("No Stripe publishable key set when building")
    }

    setStripe(window.Stripe(process.env.STRIPE_KEY))
  }, [])

  const [isFormVisible, setFormVisible] = React.useState(true)

  if (!currentUser) {
    return <></>
  }

  return (
    <StripeProvider stripe={stripe}>
      <main className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg my-8 text-neutral-10">
        <Head title="Subscribe to Courier" />

        <h1 className="text-primary-10 font-medium text-center p-3 border-b border-neutral-2">
          Subscribe to Courier
        </h1>
        <div className="text-6xl font-medium text-center p-6 flex flex-row justify-center items-start">
          <span
            className="font-bold text-primary-7"
            style={{ lineHeight: "64px" }}
          >
            $5
          </span>
          <span className="text-sm ml-2 text-neutral-8">per month</span>
        </div>
        <div className="px-6 pb-4">
          <p className="mb-4 leading-relaxed">
            Once you subscribe, you'll be able to post to Twitter using Courier:
          </p>
          <ul className="fa-ul leading-loose mb-4">
            <li>
              <span className="fa-li text-primary-10">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
              Decide which tweets to post from the Courier dashboard
            </li>
            <li>
              <span className="fa-li text-primary-10">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
              Set up feeds to post to Twitter automatically
            </li>
          </ul>
          <p className="leading-relaxed">
            You can cancel your subscription at any time and continue to post
            tweets with Courier for the remainder of time you've paid for.
          </p>
        </div>

        {isFormVisible ? (
          <Elements fonts={[{ cssSrc: "https://rsms.me/inter/inter.css" }]}>
            <SubscribeForm user={currentUser} />
          </Elements>
        ) : (
          <div className="flex justify-center p-6">
            <button
              type="button"
              className="btn btn-first btn-first-primary text-xl font-medium py-2 px-10"
              onClick={() => setFormVisible(true)}
            >
              <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
              Subscribe
            </button>
          </div>
        )}
      </main>
    </StripeProvider>
  )
}

export default withData(withSecurePage(SubscribePage), {
  query: graphql`
    query SubscribePageQuery {
      currentUser {
        ...SubscribeForm_user
      }
    }
  `,
})
