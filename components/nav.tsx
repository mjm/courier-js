import React from "react"
import Link from "next/link"
import { font, colors, spacing, shadow } from "../utils/theme"

const Nav = () => (
  <nav>
    <ul>
      <li>
        <Link prefetch href="/">
          <a className="brand">Courier</a>
        </Link>
      </li>
      <li>
        <Link prefetch href="/feeds">
          <a>Feeds</a>
        </Link>
      </li>
    </ul>

    <style jsx>{`
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
        align-items: baseline;
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
      a {
        color: white;
        text-decoration: none;
        display: block;
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
    `}</style>
  </nav>
)

export default Nav
