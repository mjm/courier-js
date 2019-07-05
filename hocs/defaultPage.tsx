import React from "react"
import { getUser, isAuthenticated } from "../utils/auth0"
import Nav from "../components/nav"

interface Props {
  user: any
  isAuthenticating: boolean
  [key: string]: any
}

export default (Page: any) =>
  class DefaultPage extends React.Component<Props> {
    static async getInitialProps(ctx: any): Promise<any> {
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

    render() {
      return (
        <>
          <Nav
            user={this.props.user}
            isAuthenticating={this.props.isAuthenticating}
          />
          <Page {...this.props} />
        </>
      )
    }
  }
