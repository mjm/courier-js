import { ApolloServerPlugin } from "apollo-server-plugin-base"

import { CourierContext } from "lib/context"

const serverEventsPlugin: ApolloServerPlugin<CourierContext> = {
  requestDidStart(ctx) {
    const evt = ctx.context.evt.push("graphql_request")
    evt.add({
      "gql.operation_name": ctx.operationName,
      "gql.http.method": ctx.request.http?.method,
      "gql.http.url": ctx.request.http?.url,
    })

    return {
      willSendResponse(ctx) {
        ctx.context.evt.pop()
      },
    }
  },
}

export default serverEventsPlugin
