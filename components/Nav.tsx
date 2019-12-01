import React from "react"
import styled from "@emotion/styled"
import Link from "next/link"
import {
  faPaperPlane,
  faRss,
  IconDefinition,
  faSignInAlt,
  faDollarSign,
  faQuestion,
  faStar,
  faBars,
} from "@fortawesome/free-solid-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { Card, Image, Flex } from "@rebass/emotion"
import Icon from "./Icon"
import { BodyStyles } from "./BodyStyles"
import { DialogStyles } from "./DialogStyles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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

const ToggleButton = styled.button(({ theme }) => ({
  position: "absolute",
  top: 8,
  right: 16,
  display: "inline-block",
  backgroundColor: theme.colors.primary[700],
  color: "white",
  border: 0,
  outline: "none",
  [`@media (min-width: ${theme.breakpoints[0]})`]: {
    display: "none",
  },
}))

const Username = styled.span``

interface Props {
  user?: any
  isAuthenticating?: boolean
}

const Nav = ({ user, isAuthenticating = false }: Props) => {
  const [menuVisible, setMenuVisible] = React.useState(false)

  return (
    <Card as="nav" bg="primary.700" boxShadow="sm">
      <BodyStyles />
      <DialogStyles />

      <Flex
        as="ul"
        alignItems={["stretch", "center"]}
        flexDirection={["column", "row"]}
        my={0}
        mx={[0, 3]}
        px={2}
        css={{ listStyle: "none", lineHeight: "1.6em" }}
      >
        <ToggleButton onClick={() => setMenuVisible(v => !v)}>
          <FontAwesomeIcon icon={faBars} />
        </ToggleButton>
        <NavItem brand href="/" icon={faPaperPlane}>
          Courier
        </NavItem>
        <li
          css={{
            flexGrow: 1,
            display: menuVisible ? "block" : "none",
            "@media (min-width: 640px)": { display: "block" },
          }}
        >
          <Flex
            as="ul"
            alignItems="center"
            flexDirection={["column", "row"]}
            px={0}
            css={{ listStyle: "none" }}
          >
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
        </li>
      </Flex>
    </Card>
  )
}

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
