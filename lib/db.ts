import { createPool, InterceptorType } from "slonik"
import { createInterceptors } from "slonik-interceptor-preset"
import moment from "moment"

const pool = createPool(process.env.DATABASE_URL || "", {
  typeParsers: [
    {
      name: "timestamp",
      parse(value) {
        return value && moment.utc(value).toDate()
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
export * from "slonik"

function createLoggingInterceptor(): InterceptorType {
  return {
    afterQueryExecution(_context, query, result) {
      console.log({
        sql: query.sql,
        values: query.values,
        rows: result.rowCount,
      })
      return null
    },
  }
}
