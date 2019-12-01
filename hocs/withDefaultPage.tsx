import React from "react"
import { getUser, isAuthenticated } from "../utils/auth0"
import Nav from "../components/Nav"
import { NextPageContext, NextPage } from "next"
import { ThemeProvider } from "emotion-theming"
import { AuthProvider } from "../components/AuthProvider"
import { theme } from "../components/Styled"

type DefaultPageProps<T> = T & {
  user: any
  isAuthenticating: boolean
  isAuthenticated: boolean
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
  Page: NextPage<T>
): DefaultPageResult<T> {
  const defaultPage: DefaultPageResult<T> = props => {
    const { user, isAuthenticated, isAuthenticating } = props

    return (
      <ThemeProvider theme={theme}>
        <AuthProvider
          user={user}
          isAuthenticated={isAuthenticated}
          isAuthenticating={isAuthenticating}
        >
          <Nav user={user} isAuthenticating={isAuthenticating} />
          <Page {...props} />
        </AuthProvider>
      </ThemeProvider>
    )
  }

  defaultPage.getInitialProps = async ctx => {
    const req = ctx && ctx.req
    const user = getUser(req)

    let pageProps: any = {}
    if (Page.getInitialProps) {
      pageProps = await Page.getInitialProps({ ...ctx, user } as any)
    }

    return {
      ...pageProps,
      user,
      isAuthenticated: !!user && isAuthenticated(req),
    }
  }

  return defaultPage
}
