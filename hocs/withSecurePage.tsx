import React from "react"
import withDefaultPage, { DefaultPage } from "hocs/withDefaultPage"
import Loading from "components/Loading"
import { NextPage } from "next"
import { useAuth } from "components/AuthProvider"
import Router from "next/router"

export default function withSecurePage<P, IP>(
  Page: NextPage<P, IP>
): DefaultPage<P, IP> {
  const securePage: NextPage<P, IP> = props => {
    const { isAuthenticated, isAuthenticating } = useAuth()

    if (!isAuthenticated) {
      if (!isAuthenticating) {
        Router.push("/login")
      }
      return <Loading />
    }

    return <Page {...props} />
  }

  if (Page.getInitialProps) {
    securePage.getInitialProps = Page.getInitialProps.bind(Page)
  }

  return withDefaultPage(securePage)
}
