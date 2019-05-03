import { withData } from "next-apollo"
import { HttpLink } from "apollo-boost"
import url from "./url"
import { NextContext } from "next"

const config = (ctx: NextContext) => ({
  link: new HttpLink({
    uri: url("/graphql", ctx && ctx.req),
  }),
})

export default withData(config)
