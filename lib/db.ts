import { createPool, InterceptorType } from "@mmoriarity/slonik"
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
