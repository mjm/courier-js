import micro from "../lib/micro"
import { xmlrpc, XMLRPCRequestHandler } from "../lib/xmlrpc"
import { createContext } from "../lib/context"

const context = createContext()

const handler: XMLRPCRequestHandler = async ({ methodName, params }) => {
  const { feeds } = await context

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

export default micro(xmlrpc(handler))
