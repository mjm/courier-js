import React from "react"
import withDefaultPage from "./defaultPage"
import Link from "next/link"
import Loading from "../components/loading"

interface Props {
  isAuthenticated: boolean
  isAuthenticating: boolean
}

const securePage = (Page: any) =>
  class SecurePage extends React.Component<Props> {
    static async getInitialProps(ctx: any) {
      let pageProps = {}

      if (Page.getInitialProps) {
        pageProps = await Page.getInitialProps(ctx)
      }

      return pageProps
    }

    render() {
      if (!this.props.isAuthenticated) {
        if (this.props.isAuthenticating) {
          return <Loading />
        } else {
          return (
            <p>
              You are not authorized to see this page.
              <Link href="/login">
                <a>Login</a>
              </Link>
            </p>
          )
        }
      }

      return <Page {...this.props} />
    }
  }

export default (Page: any) => withDefaultPage(securePage(Page))
