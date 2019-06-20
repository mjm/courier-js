import { createPool } from "slonik"
import { createInterceptors } from "slonik-interceptor-preset"

const pool = createPool(process.env.DATABASE_URL || "", {
  typeParsers: [
    // we don't use the XML type, but we need something to be here to not
    // use slonik's default type parsers, which muck up our whole Date situation
    {
      name: "xml",
      parse(value) {
        return value
      },
    },
  ],
  interceptors: [...createInterceptors()],
})

export default pool
export * from "slonik"
