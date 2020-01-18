import { xmlrpc, XMLRPCRequestHandler } from "lib/xmlrpc"
import { CourierContext } from "lib/context"

const { feeds } = CourierContext.create()

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
    )
    // @ts-ignore
    err.faultCode = 404
    // @ts-ignore
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
