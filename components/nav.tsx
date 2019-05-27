import React from "react"
import styled, { createGlobalStyle } from "styled-components"
import Link from "next/link"
import { font, colors, spacing, shadow } from "../utils/theme"
import { faPaperPlane, faRss } from "@fortawesome/free-solid-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "@reach/dialog/styles.css"

const BodyStyles = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
  body {
    font-family: ${font.body};
    background-color: #f9ffff;
  }
`

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

const StyledNav = styled.nav`
  text-align: center;
  background-color: ${colors.primary[700]};
  box-shadow: ${shadow.sm};
`

const NavList = styled.ul`
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1.8rem;

  ${StyledNav} > & {
    padding: 0 ${spacing(2)};
  }

  @media (min-width: 640px) {
    ${StyledNav} > & {
      margin: 0 ${spacing(4)};
    }
  }
`

const NavItem = styled.li`
  display: flex;
  align-items: stretch;
  height: 100%;
`
const SpacerItem = styled(NavItem)`
  flex-grow: 1;
`

const NavLink = styled.a`
  color: white;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  padding: ${spacing(2)} ${spacing(3)};
  height: 100%;
  flex-shrink: 0;

  :hover {
    background-color: ${colors.primary[600]};
  }

  @media (min-width: 640px) {
    padding: ${spacing(3)} ${spacing(4)};
  }
`
const BrandLink = styled(NavLink)`
  font-size: 1.2rem;
  font-weight: 700;
  font-family: ${font.display};
`

const NavIcon = styled(FontAwesomeIcon)`
  margin-right: ${spacing(2)};
  color: ${colors.primary[100]};
`

const Avatar = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 9999px;
  margin-right: ${spacing(2)};
`

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
  <StyledNav>
    <BodyStyles />
    <DialogStyles />
    <NavList>
      <NavItem>
        <Link prefetch href="/" passHref>
          <BrandLink>
            <NavIcon icon={faPaperPlane} />
            Courier
          </BrandLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link prefetch href="/tweets" passHref>
          <NavLink>
            <NavIcon icon={faTwitter} />
            Tweets
          </NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link prefetch href="/feeds" passHref>
          <NavLink>
            <NavIcon icon={faRss} />
            Feeds
          </NavLink>
        </Link>
      </NavItem>
      <SpacerItem />
      {user ? (
        <NavItem>
          <Link href="/account" passHref>
            <NavLink>
              <Avatar src={user.picture} />
              <Username>{user.name}</Username>
            </NavLink>
          </Link>
        </NavItem>
      ) : isAuthenticating ? null : (
        <NavItem>
          <Link href="/login" passHref>
            <NavLink>Login</NavLink>
          </Link>
        </NavItem>
      )}
    </NavList>
  </StyledNav>
)

export default Nav
