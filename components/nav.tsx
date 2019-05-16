import React from "react"
import Link from "next/link"
import { font, colors, spacing, shadow } from "../utils/theme"
import { faPaperPlane, faRss } from "@fortawesome/free-solid-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
  user: any
  isAuthenticating: boolean
}

const Nav = ({ user, isAuthenticating }: Props) => (
  <nav>
    <ul>
      <li>
        <Link prefetch href="/">
          <a className="brand">
            <FontAwesomeIcon icon={faPaperPlane} />
            Courier
          </a>
        </Link>
      </li>
      <li>
        <Link prefetch href="/tweets">
          <a>
            <FontAwesomeIcon icon={faTwitter} />
            Tweets
          </a>
        </Link>
      </li>
      <li>
        <Link prefetch href="/feeds">
          <a>
            <FontAwesomeIcon icon={faRss} />
            Feeds
          </a>
        </Link>
      </li>
      <li className="spacer" />
      {user ? (
        <li>
          <a href="#">
            <img src={user.picture} /> {user.name}
          </a>
        </li>
      ) : isAuthenticating ? null : (
        <li>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </li>
      )}
    </ul>

    <style jsx>{`
      :global(html) {
        box-sizing: border-box;
      }
      :global(*),
      :global(*):before,
      :global(*):after {
        box-sizing: inherit;
      }
      :global(body) {
        font-family: ${font.body};
        background-color: #f9ffff;
      }
      nav {
        text-align: center;
        background-color: ${colors.primary[700]};
        box-shadow: ${shadow.sm};
      }
      ul {
        margin: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 1.8rem;
      }
      nav > ul {
        padding: 0 ${spacing(4)};
      }
      li {
        display: flex;
        align-items: stretch;
        height: 100%;
      }
      li.spacer {
        flex-grow: 1;
      }
      a {
        color: white;
        font-weight: 500;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        padding: ${spacing(3)} ${spacing(4)};
        height: 100%;
      }
      a.brand {
        font-size: 1.2rem;
        font-weight: 700;
        font-family: ${font.display};
      }
      a:hover {
        background-color: ${colors.primary[600]};
      }
      a > :global(svg) {
        margin-right: ${spacing(2)};
        color: ${colors.primary[100]};
      }
      img {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 9999px;
        margin-right: ${spacing(2)};
      }
    `}</style>
  </nav>
)

export default Nav
