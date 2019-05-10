import React from "react"
import { getUser, isAuthenticated } from "../utils/auth0"

export default (Page: any) =>
  class DefaultPage extends React.Component {
    static async getInitialProps(ctx: any): Promise<any> {
      const req = ctx && ctx.req
      const user = getUser(req)
      let pageProps: any = {}
      if (Page.getInitialProps) {
        pageProps = await Page.getInitialProps(ctx)
      }

      return {
        ...pageProps,
        user,
        currentUrl: ctx.pathname,
        isAuthenticated: !!user && isAuthenticated(req),
      }
    }

    render() {
      return <Page {...this.props} />
    }
  }
