import { ApolloServerPlugin } from "apollo-server-plugin-base"

import { CourierContext } from "lib/context"

const serverEventsPlugin: ApolloServerPlugin<CourierContext> = {
  requestDidStart(ctx) {
    const evt = ctx.context.evt.push("graphql_request")
    evt.add({
      "http.method": ctx.request.http?.method,
      "http.url": ctx.request.http?.url,
    })

    return {
      parsingDidStart(ctx) {
        ctx.context.evt.push("graphql_parsing")

        return err => {
          if (err) {
            ctx.context.evt.current.add({ err })
          }
          ctx.context.evt.pop()
        }
      },
      validationDidStart(ctx) {
        ctx.context.evt.push("graphql_validation")

        return errs => {
          if (errs) {
            ctx.context.evt.current.add({
              err: errs.map(e => e.toString()).join("\n"),
            })
          }
          ctx.context.evt.pop()
        }
      },
      executionDidStart(ctx) {
        const evt = ctx.context.evt.push("graphql_execution")
        evt.add({
          "gql.operation_name": ctx.operationName,
        })

        return err => {
          if (err) {
            ctx.context.evt.current.add({ err })
          }
          ctx.context.evt.pop()
        }
      },
      willSendResponse(ctx) {
        ctx.context.evt.pop()
      },
    }
  },
}

export default serverEventsPlugin
