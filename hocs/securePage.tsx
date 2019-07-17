import React from "react"
import withDefaultPage, { DefaultPageResult } from "./defaultPage"
import Link from "next/link"
import Loading from "../components/loading"
import { PageHeader } from "../components/header"
import Head from "../components/head"
import {
  faSignInAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"
import Icon from "../components/icon"
import { Text, Flex, Card, Button } from "@rebass/emotion"
import { NextPage } from "next"
import { useAuth } from "../hooks/auth"

export default function withSecurePage<T>(
  Page: NextPage<T>
): DefaultPageResult<T> {
  const securePage: NextPage<T> = props => {
    const { isAuthenticated, isAuthenticating } = useAuth()

    if (!isAuthenticated) {
      if (isAuthenticating) {
        return <Loading />
      } else {
        return (
          <Card
            my="20vh"
            mx="auto"
            bg="white"
            boxShadow="lg"
            borderTop="4px solid"
            borderColor="primary.500"
            p={3}
            pb={5}
            css={{ maxWidth: "600px" }}
          >
            <Flex flexDirection="column" alignItems="center">
              <Head title="Log In to Courier" />
              <PageHeader>
                <Icon mr={2} color="primary.700" icon={faExclamationTriangle} />
                Uh Oh!
              </PageHeader>
              <Text fontSize={3} textAlign="center" my={3}>
                You need to be logged in to see this page.
              </Text>
              <Link href="/login" passHref>
                <LoginLink />
              </Link>
            </Flex>
          </Card>
        )
      }
    }

    return <Page {...props} />
  }

  if (Page.getInitialProps) {
    securePage.getInitialProps = async ctx => {
      if (Page.getInitialProps) {
        return await Page.getInitialProps(ctx)
      }

      throw new Error("getInitialProps was defined later")
    }
  }

  return withDefaultPage(securePage)
}

const LoginLink = ({ href }: { href?: string }) => (
  <Button
    as="a"
    href={href}
    px={3}
    py={2}
    bg="primary.600"
    fontSize={4}
    fontWeight={500}
    css={theme => ({
      fontFamily: theme.fonts.display,
      boxShadow: theme.shadows.md,
      textTransform: "uppercase",
      ":hover": {
        backgroundColor: theme.colors.primary[500],
      },
    })}
  >
    <Icon mr={2} icon={faSignInAlt} />
    Login
  </Button>
)
