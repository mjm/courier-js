import React from "react"

import {NextPage} from "next"
import Router from "next/router"

import {useAuth} from "components/AuthProvider"
import Loading from "components/Loading"
import withDefaultPage from "hocs/withDefaultPage"

export default function withSecurePage<P, IP>(
  Page: NextPage<P, IP>
): NextPage<P & { isAuthenticating: boolean }, IP> {
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

  securePage.displayName = `withSecurePage(${Page.displayName || Page.name})`

  if (Page.getInitialProps) {
    securePage.getInitialProps = Page.getInitialProps.bind(Page)
  }

  return withDefaultPage(securePage)
}
