import React, {Suspense} from "react"

import {NextPage} from "next"

import {AuthProvider} from "components/AuthProvider"
import ErrorBoundary from "components/ErrorBoundary"
import {EventsProvider} from "components/EventsProvider"
import Head from "components/Head"
import Loading from "components/Loading"
import Nav from "components/Nav"
import {getUser} from "utils/auth0"

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
            <Suspense
              fallback={
                <main className="container my-8 mx-auto py-0 px-8">
                  <Head title="Loading…" />
                  <Loading />
                </main>
              }
            >
              <Page {...props} />
            </Suspense>
          </ErrorBoundary>
        </EventsProvider>
      </AuthProvider>
    )
  }

  defaultPage.displayName = `withDefaultPage(${Page.displayName || Page.name})`

  if (Page.getInitialProps) {
    defaultPage.getInitialProps = Page.getInitialProps.bind(Page)
  }

  return defaultPage
}
