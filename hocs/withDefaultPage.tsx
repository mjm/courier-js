import React, { Suspense } from "react"

import { NextComponentType, NextPage, NextPageContext } from "next"

import { AuthProvider } from "components/AuthProvider"
import { EventsProvider } from "components/EventsProvider"
import Nav from "components/Nav"
import { getUser, IdToken, isAuthenticated } from "utils/auth0"
import Loading from "components/Loading"

export type DefaultPageWrapped<P = {}, IP = P> = NextComponentType<
  DefaultPageContext,
  IP,
  P
>

export type DefaultPage<P, IP = P> = NextPage<
  P & {
    user: IdToken | undefined
    isAuthenticating: boolean
    isAuthenticated: boolean
  },
  IP & {
    user: IdToken | undefined
    isAuthenticated: boolean
  }
>

export interface DefaultPageContext extends NextPageContext {
  user: IdToken | undefined
}

export default function withDefaultPage<P, IP = P>(
  Page: DefaultPageWrapped<P, IP>
): DefaultPage<P, IP> {
  const defaultPage: DefaultPage<P, IP> = props => {
    const { user, isAuthenticated, isAuthenticating } = props

    return (
      <AuthProvider
        user={user}
        isAuthenticated={isAuthenticated}
        isAuthenticating={isAuthenticating}
      >
        <EventsProvider>
          <Nav user={user} isAuthenticating={isAuthenticating} />
          <Suspense fallback={<Loading />}>
            <Page {...props} />
          </Suspense>
        </EventsProvider>
      </AuthProvider>
    )
  }

  defaultPage.getInitialProps = async ctx => {
    const req = ctx && ctx.req
    const user = getUser(req)

    let pageProps = {}
    if (Page.getInitialProps) {
      pageProps = await Page.getInitialProps({ ...ctx, user })
    }

    return {
      ...(pageProps as IP),
      user,
      isAuthenticated: !!user && isAuthenticated(req),
    }
  }

  return defaultPage
}
