import Link from "next/link"

import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { MDXProvider, MDXProviderComponents } from "@mdx-js/react"

import Nav from "components/Nav"

const components: MDXProviderComponents = {
  wrapper: ({ children }) => (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-8 my-8 text-neutral-10">
        {children}
      </main>
    </>
  ),
  h1: props => <h1 className="text-3xl text-primary-10 mt-4 mb-2" {...props} />,
  h2: props => <h2 className="text-xl text-primary-10 mt-4 mb-1" {...props} />,
  h3: props => (
    <h2 className="font-medium text-primary-10 mt-3 mb-1" {...props} />
  ),
  p: props => <p className="mb-2" {...props} />,
  ul: props => <ul className="fa-ul leading-loose" {...props} />,
  li: ({ children, ...props }) => (
    <li {...props}>
      <span className="fa-li text-primary-10">
        <FontAwesomeIcon icon={faCheckCircle} />
      </span>
      {children}
    </li>
  ),
  a: ({ href, ...props }) => {
    if (href[0] === "/") {
      return (
        <Link href={href}>
          <a className="text-primary-10 hover:underline" {...props} />
        </Link>
      )
    } else {
      return <a href={href} target="_blank" {...props} />
    }
  },
  inlineCode: props => <code className="text-sm" {...props} />,
}

const MDXContainer: React.FC = ({ children }) => (
  <MDXProvider components={components}>{children}</MDXProvider>
)

export default MDXContainer
