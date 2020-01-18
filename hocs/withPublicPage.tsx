import { NextPage } from "next"
import Nav from "components/Nav"

export default function withPublicPage<T>(Page: NextPage<T>): NextPage<T> {
  return (props: T) => {
    return (
      <>
        <Nav />
        <Page {...props} />
      </>
    )
  }
}
