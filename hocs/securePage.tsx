import React from "react"
import styled from "@emotion/styled"
import withDefaultPage from "./defaultPage"
import Link from "next/link"
import Loading from "../components/loading"
import { PageHeader } from "../components/header"
import Head from "../components/head"
import { spacing, colors, shadow, font } from "../utils/theme"
import {
  faSignInAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"
import Icon from "../components/icon"

const Container = styled.div`
  margin: 20vh auto;
  max-width: 600px;
  background-color: white;
  padding: 1rem 1rem 3rem 1rem;
  box-shadow: ${shadow.lg};
  border-top: 4px solid ${colors.primary[500]};
  display: flex;
  flex-direction: column;
  align-items: center;

  & > p {
    text-align: center;
    font-size: 1.2rem;
    margin-top: 0;
  }
`

const LoginLink = styled.a`
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

  :hover {
    background-color: ${colors.primary[500]};
  }
`

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
            <Container>
              <Head title="Log In to Courier" />
              <PageHeader>
                <Icon
                  mr={2}
                  color="primary.700"
                  fontSize={7}
                  icon={faExclamationTriangle}
                />
                Uh Oh!
              </PageHeader>
              <p>You need to be logged in to see this page.</p>
              <Link href="/login" passHref>
                <LoginLink>
                  <Icon icon={faSignInAlt} />
                  Login
                </LoginLink>
              </Link>
            </Container>
          )
        }
      }

      return <Page {...this.props} />
    }
  }

export default (Page: any) => withDefaultPage(securePage(Page))
