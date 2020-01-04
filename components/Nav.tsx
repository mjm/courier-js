import React from "react"
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
import Icon from "components/Icon"
import { BodyStyles } from "components/BodyStyles"
import { DialogStyles } from "components/DialogStyles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/router"

interface Props {
  user?: any
  isAuthenticating?: boolean
}

const Nav = ({ user, isAuthenticating = false }: Props) => {
  const [menuVisible, setMenuVisible] = React.useState(false)

  return (
    <nav className="bg-white shadow-lg border-primary-5 border-t-4">
      <BodyStyles />
      <DialogStyles />

      <ul className="my-0 mx-0 px-2 leading-relaxed flex flex-col sm:flex-row items-stretch sm:items-center">
        <button
          className="absolute top-0 right-0 mr-4 mt-2 inline-block text-primary-9 border-0 outline-none sm:hidden"
          onClick={() => setMenuVisible(v => !v)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <NavItem brand href="/" icon={faPaperPlane} />
        <li
          className={`flex-grow ${menuVisible ? "block" : "hidden"} sm:block`}
        >
          <ul className="flex items-center flex-col sm:flex-row px-0">
            {user ? (
              <>
                <li className="flex-grow" />
                <NavItem href="/tweets" icon={faTwitter}>
                  Tweets
                </NavItem>
                <NavItem href="/feeds" icon={faRss}>
                  Feeds
                </NavItem>
                <li className="flex-grow" />
                <NavItem href="/account">
                  <img
                    className="w-6 h-6 mr-2 rounded-full"
                    src={user.picture}
                  />
                  <span>{user.name}</span>
                </NavItem>
              </>
            ) : isAuthenticating ? null : (
              <>
                <li className="flex-grow" />
                <NavItem href="/features" icon={faStar}>
                  Features
                </NavItem>
                <NavItem href="/pricing" icon={faDollarSign}>
                  Pricing
                </NavItem>
                <NavItem href="/faq" icon={faQuestion}>
                  FAQ
                </NavItem>
                <li className="flex-grow" />
                <NavItem href="/login" icon={faSignInAlt}>
                  Login
                </NavItem>
              </>
            )}
          </ul>
        </li>
      </ul>
    </nav>
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
  const router = useRouter()

  const brandClass = brand ? "font-display text-2xl text-primary-9" : ""
  const activeClass = router.pathname.startsWith(href)
    ? "text-primary-9"
    : "text-neutral-5"

  return (
    <li>
      <Link href={href}>
        <a
          className={`font-bold no-underline inline-flex items-center py-2 px-3 h-full flex-shrink-0 sm:py-3 sm:py-4 hover:text-primary-7 ${activeClass} ${brandClass}`}
        >
          {icon && <Icon mr={2} icon={icon} />}
          {children}
        </a>
      </Link>
    </li>
  )
}
