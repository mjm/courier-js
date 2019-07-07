import React from "react"
import styled from "@emotion/styled"
import { Global, InterpolationWithTheme } from "@emotion/core"
import Link from "next/link"
import {
  faPaperPlane,
  faRss,
  IconDefinition,
  faSignInAlt,
  faDollarSign,
  faQuestion,
  faStar,
} from "@fortawesome/free-solid-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { Card, Image, Flex } from "@rebass/emotion"
import Icon from "./icon"

import "@reach/dialog/styles.css"

const bodyStyles: InterpolationWithTheme<any> = theme => ({
  html: {
    boxSizing: "border-box",
  },
  "*, *:before, *:after": {
    boxSizing: "inherit",
  },
  body: {
    fontFamily: theme.fonts.body,
    backgroundColor: "#f9ffff",
  },
})

const dialogStyles: InterpolationWithTheme<any> = theme => ({
  "[data-reach-dialog-content]": {
    width: "500px",
    maxWidth: "100%",
    backgroundColor: "white",
    boxShadow: theme.shadow.lg,
    padding: theme.space[3],
    borderTop: `3px solid ${theme.colors.primary[600]}`,
    borderBottomLeftRadius: "0.25rem",
    borderBottomRightRadius: "0.25rem",
  },
  "[data-reach-alert-dialog-label]": {
    fontFamily: theme.font.display,
    fontSize: "1.2rem",
    fontWeight: 500,
    marginBottom: theme.space[2],
    color: theme.colors.primary[800],
  },
  "[data-reach-alert-dialog-description]": {
    lineHeight: theme.lineHeights.normal,
  },
})

const NavLink = styled.a(({ theme }) => ({
  color: "white",
  fontWeight: 500,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  padding: `${theme.space[2]} ${theme.space[3]}`,
  height: "100%",
  flexShrink: 0,
  ":hover": {
    backgroundColor: theme.colors.primary[600],
  },
  "@media (min-width: 640px)": {
    padding: theme.space[3],
  },
}))

const BrandLink = styled(NavLink)(({ theme }) => ({
  fontSize: theme.fontSizes[4],
  fontWeight: 700,
  fontFamily: theme.font.display,
}))

const Username = styled.span`
  text-indent: -9999px;
  width: 0;

  @media (min-width: 640px) {
    text-indent: 0;
    width: auto;
  }
`

interface Props {
  user: any
  isAuthenticating: boolean
}

const Nav = ({ user, isAuthenticating }: Props) => (
  <Card as="nav" bg="primary.700" boxShadow="sm">
    <Global styles={bodyStyles} />
    <Global styles={dialogStyles} />
    <Flex
      as="ul"
      alignItems="center"
      my={0}
      mx={[0, 3]}
      px={2}
      css={{ listStyle: "none", lineHeight: "1.6em" }}
    >
      <NavItem brand href="/" icon={faPaperPlane}>
        Courier
      </NavItem>
      {user ? (
        <>
          <NavItem href="/tweets" icon={faTwitter}>
            Tweets
          </NavItem>
          <NavItem href="/feeds" icon={faRss}>
            Feeds
          </NavItem>
          <li css={{ flexGrow: 1 }} />
          <NavItem href="/account">
            <Image
              src={user.picture}
              width={20}
              height={20}
              mr={2}
              borderRadius="9999px"
            />
            <Username>{user.name}</Username>
          </NavItem>
        </>
      ) : isAuthenticating ? null : (
        <>
          <NavItem href="/features" icon={faStar}>
            Features
          </NavItem>
          <NavItem href="/pricing" icon={faDollarSign}>
            Pricing
          </NavItem>
          <NavItem href="/faq" icon={faQuestion}>
            FAQ
          </NavItem>
          <li css={{ flexGrow: 1 }} />
          <NavItem href="/login" icon={faSignInAlt}>
            Login
          </NavItem>
        </>
      )}
    </Flex>
  </Card>
)

export default Nav

interface NavItemProps {
  href: string
  icon?: IconDefinition
  children: React.ReactNode
  brand?: boolean
}
const NavItem = ({ href, icon, children, brand = false }: NavItemProps) => {
  const LinkType = brand ? BrandLink : NavLink
  return (
    <li>
      <Link href={href} passHref>
        <LinkType>
          {icon && <Icon mr={2} color="primary.100" icon={icon} />}
          {children}
        </LinkType>
      </Link>
    </li>
  )
}
