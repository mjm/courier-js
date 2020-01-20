import { interfaces } from "inversify"
import { Event } from "libhoney"
import moment from "moment"
import { createPool, DatabasePoolType, InterceptorType } from "slonik"
import { createInterceptors } from "slonik-interceptor-preset"

import Environment from "lib/env"
import { EventContext } from "lib/events"

export function createDatabase(context: interfaces.Context): DatabasePoolType {
  const env = context.container.get(Environment)
  const events = context.container.get(EventContext)

  return createPool(env.databaseUrl, {
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
      createLoggingInterceptor(events),
    ],
    captureStackTrace: false,
  })
}

export * from "slonik"

function createLoggingInterceptor(events: EventContext): InterceptorType {
  return {
    beforeQueryExecution(context, query) {
      const evt = events.startSpan("sql_query")
      evt.add({
        "sql.connection_id": context.connectionId,
        "sql.pool_id": context.poolId,
        "sql.query_id": context.queryId,
        "sql.transaction_id": context.transactionId,
        "sql.query": query.sql,
      })
      context.sandbox.evt = evt
      console.log({
        sql: query.sql,
        values: query.values,
      })
      return null
    },

    afterQueryExecution(context, query, result) {
      const evt = context.sandbox.evt as Event
      evt.add({ "sql.row_count": result.rowCount })
      events.stopSpan(evt)

      console.log({
        sql: query.sql,
        values: query.values,
        rows: result.rowCount,
      })
      return null
    },
  }
}
