import React from "react"

import { NextComponentType,NextPage, NextPageContext } from "next"

import { AuthProvider } from "components/AuthProvider"
import Nav from "components/Nav"
import { getUser, isAuthenticated } from "utils/auth0"

export type DefaultPageWrapped<P = {}, IP = P> = NextComponentType<
  DefaultPageContext,
  IP,
  P
>

export type DefaultPage<P, IP = P> = NextPage<
  P & {
    user: any
    isAuthenticating: boolean
    isAuthenticated: boolean
  },
  IP & {
    user: any
    isAuthenticated: boolean
  }
>

export interface DefaultPageContext extends NextPageContext {
  user: any
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
        <Nav user={user} isAuthenticating={isAuthenticating} />
        <Page {...props} />
      </AuthProvider>
    )
  }

  defaultPage.getInitialProps = async ctx => {
    const req = ctx && ctx.req
    const user = getUser(req)

    let pageProps: any = {}
    if (Page.getInitialProps) {
      pageProps = await Page.getInitialProps({ ...ctx, user })
    }

    return {
      ...pageProps,
      user,
      isAuthenticated: !!user && isAuthenticated(req),
    }
  }

  return defaultPage
}
