import React, { Suspense } from "react"

import { NextPage } from "next"
import { EventsProvider } from "components/EventsProvider"
import Nav from "components/Nav"
import Loading from "components/Loading"
import ErrorBoundary from "components/ErrorBoundary"
import { AuthProvider } from "components/AuthProvider"
import { getUser } from "utils/auth0"

export default function withDefaultPage<P, IP = P>(
  Page: NextPage<P, IP>
): NextPage<P & { isAuthenticating: boolean }, IP> {
  const defaultPage: NextPage<
    P & { isAuthenticating: boolean },
    IP
  > = props => {
    const user = getUser()
    return (
      <AuthProvider
        user={user}
        isAuthenticated={!!user && !props.isAuthenticating}
        isAuthenticating={props.isAuthenticating}
      >
        <EventsProvider>
          <Nav />
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              <Page {...props} />
            </Suspense>
          </ErrorBoundary>
        </EventsProvider>
      </AuthProvider>
    )
  }

  if (Page.getInitialProps) {
    defaultPage.getInitialProps = Page.getInitialProps.bind(Page)
  }

  return defaultPage
}
