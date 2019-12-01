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
import { ThemeType } from "components/Styled"
import { useRouter } from "next/router"

const NavLink = styled.a<{ active?: boolean }>(({ active, theme }) => ({
  color: active ? theme.colors.primary9 : theme.colors.neutral5,
  fontWeight: theme.fontWeights.bold,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  padding: `${theme.space[2]} ${theme.space[3]}`,
  height: "100%",
  flexShrink: 0,
  ":hover": {
    color: theme.colors.primary7,
  },
  "@media (min-width: 640px)": {
    padding: `${theme.space[3]} ${theme.space[4]}`,
  },
}))

const BrandLink = styled(NavLink)(({ theme }) => ({
  color: theme.colors.primary9,
  fontSize: theme.fontSizes[5],
  fontWeight: 700,
  fontFamily: theme.font.display,
}))

const ToggleButton = styled.button(({ theme }) => ({
  position: "absolute",
  top: 10,
  right: 16,
  display: "inline-block",
  color: theme.colors.primary9,
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
    <Card
      as="nav"
      bg="white"
      boxShadow="lg"
      css={(theme: ThemeType) => ({
        borderTop: `4px solid ${theme.colors.primary5}`,
      })}
    >
      <BodyStyles />
      <DialogStyles />

      <Flex
        as="ul"
        alignItems={["stretch", "center"]}
        flexDirection={["column", "row"]}
        m={0}
        px={2}
        css={{ listStyle: "none", lineHeight: "1.6em" }}
      >
        <ToggleButton onClick={() => setMenuVisible(v => !v)}>
          <FontAwesomeIcon icon={faBars} />
        </ToggleButton>
        <NavItem brand href="/" icon={faPaperPlane} />
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
                <li css={{ flexGrow: 1 }} />
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
                    width={24}
                    height={24}
                    mr={2}
                    borderRadius="9999px"
                  />
                  <Username>{user.name}</Username>
                </NavItem>
              </>
            ) : isAuthenticating ? null : (
              <>
                <li css={{ flexGrow: 1 }} />
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
  children?: React.ReactNode
  brand?: boolean
}
const NavItem = ({ href, icon, children, brand = false }: NavItemProps) => {
  const LinkType = brand ? BrandLink : NavLink
  const router = useRouter()

  return (
    <li>
      <Link href={href} passHref>
        <LinkType active={router.pathname.startsWith(href)}>
          {icon && <Icon mr={2} icon={icon} />}
          {children}
        </LinkType>
      </Link>
    </li>
  )
}
