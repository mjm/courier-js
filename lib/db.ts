import { createPool, InterceptorType } from "@mmoriarity/slonik"
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
  interceptors: [
    ...createInterceptors({
      benchmarkQueries: false,
      logQueries: false,
      transformFieldNames: false,
    }),
    createLoggingInterceptor(),
  ],
  captureStackTrace: false,
})

export default pool
export * from "@mmoriarity/slonik"

function createLoggingInterceptor(): InterceptorType {
  return {
    async afterQueryExecution(_context, query, result) {
      console.log({
        sql: query.sql,
        values: query.values,
        rows: result.rowCount,
      })
      return result
    },
  }
}
