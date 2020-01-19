import { xmlrpc, XMLRPCRequestHandler } from "lib/xmlrpc"
import { CourierContext } from "lib/context"

const { feeds } = CourierContext.create()

interface XMLRPCError extends Error {
  faultCode: number
  faultString: string
}

const handler: XMLRPCRequestHandler = async ({ methodName, params }) => {
  if (methodName === "weblogUpdates.ping") {
    const [title, homePageURL] = params
    console.log(`Received ping for [${title}](${homePageURL})`)

    await feeds.refreshAllByHomePageURL(homePageURL)

    return {
      flerror: false,
      message: "Thanks for the ping.",
    }
  } else {
    const err = new Error(
      `This server doesn't understand the '${methodName}' method`
    ) as XMLRPCError
    err.faultCode = 404
    err.faultString = err.message
    throw err
  }
}

export default xmlrpc(handler)

export const config = {
  api: {
    bodyParser: false,
  },
}
