import React from "react"
import { getUser, isAuthenticated } from "../utils/auth0"
import Nav from "../components/nav"
import { NextPageContext, NextPage } from "next"
import { ThemeProvider } from "emotion-theming"
import * as theme from "../utils/theme"

type DefaultPageProps<T> = T & {
  user: any
  isAuthenticating: boolean
  isAuthenticated: boolean
  currentUrl: string
}

export interface DefaultPage<T> {
  (props: DefaultPageProps<T>): JSX.Element
  getInitialProps?(ctx: DefaultPageContext): Promise<T>
}

export type DefaultPageResult<T> = NextPage<DefaultPageProps<T>>

export interface DefaultPageContext extends NextPageContext {
  user: any
}

export default function withDefaultPage<T>(
  Page: DefaultPage<T>
): DefaultPageResult<T> {
  const defaultPage: DefaultPageResult<T> = props => (
    <ThemeProvider theme={theme}>
      <Nav user={props.user} isAuthenticating={props.isAuthenticating} />
      <Page {...props} />
    </ThemeProvider>
  )

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
      currentUrl: ctx.pathname,
      isAuthenticated: !!user && isAuthenticated(req),
    }
  }

  return defaultPage
}
