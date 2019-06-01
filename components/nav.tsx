import React from "react"
import { Sticky, Box, Link, Text, Flex, Avatar } from "@primer/components"
import Octicon, { Inbox, Comment, Rss } from "@githubprimer/octicons-react"
import styled, { createGlobalStyle } from "styled-components"
import NextLink from "next/link"
import { font, colors, spacing, shadow } from "../utils/theme"

import "@reach/dialog/styles.css"

const DialogStyles = createGlobalStyle`
  [data-reach-dialog-content] {
    width: 500px;
    max-width: 100%;

    background-color: white;
    box-shadow: ${shadow.lg};
    padding: ${spacing(4)};
    border-top: 3px solid ${colors.primary[600]};
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }
  [data-reach-alert-dialog-label] {
    font-family: ${font.display};
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: ${spacing(2)};
    color: ${colors.primary[800]};
  }
  [data-reach-alert-dialog-description] {
    line-height: 1.5em;
  }
`

interface Props {
  user: any
  isAuthenticating: boolean
}

const Nav = ({ user, isAuthenticating }: Props) => (
  <>
    <DialogStyles />
    <Sticky zIndex={100}>
      <Box py={3} bg="gray.9">
        <Flex
          className="p-responsive"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex alignItems="center">
            <NextLink href="/" passHref>
              <Link ml={3} color="white">
                <Flex alignItems="center" justifyContent="center">
                  <Octicon icon={Inbox} size="medium" />
                  <Text ml={3} fontSize={3}>
                    Courier
                  </Text>
                </Flex>
              </Link>
            </NextLink>
            <NextLink href="/tweets" passHref>
              <Link ml={6} color="white">
                <Flex alignItems="center" justifyContent="center">
                  <Octicon icon={Comment} size="small" />
                  <Text ml={2}>Tweets</Text>
                </Flex>
              </Link>
            </NextLink>
            <NextLink href="/feeds" passHref>
              <Link ml={4} color="white">
                <Flex alignItems="center" justifyContent="center">
                  <Octicon icon={Rss} size="small" />
                  <Text ml={2}>Feeds</Text>
                </Flex>
              </Link>
            </NextLink>
          </Flex>
          {user ? (
            <NextLink href="/account" passHref>
              <Link mx={3} color="white">
                <Flex alignItems="center" justifyContent="center">
                  <Avatar src={user.picture} />
                  <Text ml={2}>{user.name}</Text>
                </Flex>
              </Link>
            </NextLink>
          ) : isAuthenticating ? null : (
            <NextLink href="/login" passHref>
              <Link mx={3} color="white">
                <Text>Log In</Text>
              </Link>
            </NextLink>
          )}
        </Flex>
      </Box>
    </Sticky>
  </>
)

export default Nav
