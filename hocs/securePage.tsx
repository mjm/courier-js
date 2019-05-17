import React from "react"
import withDefaultPage from "./defaultPage"
import Link from "next/link"
import Loading from "../components/loading"
import { PageHeader } from "../components/header"
import Head from "../components/head"
import { spacing, colors, shadow, font } from "../utils/theme"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSignInAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"

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
            <div className="container">
              <Head title="Log In to Courier" />
              <PageHeader>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="header-icon"
                />
                Uh Oh!
              </PageHeader>
              <p>You need to be logged in to see this page.</p>
              <Link href="/login">
                <a>
                  <FontAwesomeIcon icon={faSignInAlt} />
                  Login
                </a>
              </Link>
              <style jsx>{`
                .container {
                  margin: 20vh auto;
                  max-width: 600px;
                  background-color: white;
                  padding: 1rem 1rem 3rem 1rem;
                  box-shadow: ${shadow.lg};
                  border-top: 4px solid ${colors.primary[500]};
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                }
                .container > p {
                  text-align: center;
                  font-size: 1.2rem;
                  margin-top: 0;
                }
                a {
                  display: block;
                  padding: ${spacing(3)};
                  background-color: ${colors.primary[600]};
                  color: white;
                  text-decoration: none;
                  border-radius: 0.5rem;
                  box-shadow: ${shadow.md};
                  font-size: 1.2rem;
                  font-weight: 500;
                  text-transform: uppercase;
                  font-family: ${font.display};
                }
                a:hover {
                  background-color: ${colors.primary[500]};
                }
                .container :global(svg) {
                  margin-right: ${spacing(2)};
                }
                .container :global(.header-icon) {
                  color: ${colors.primary[700]};
                  font-size: 2.5rem;
                }
              `}</style>
            </div>
          )
        }
      }

      return <Page {...this.props} />
    }
  }

export default (Page: any) => withDefaultPage(securePage(Page))
