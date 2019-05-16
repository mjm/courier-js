import micro from "../lib/micro"
import { xmlrpc, XMLRPCRequestHandler } from "../lib/xmlrpc"

const handler: XMLRPCRequestHandler = async ({ methodName, params }) => {
  if (methodName === "weblogUpdates.ping") {
    const [title, homePageURL] = params
    console.log(`[${title}](${homePageURL})`)

    // TODO actually refresh the feed

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

export default micro(xmlrpc(handler))
