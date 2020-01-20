import { CourierContext } from "lib/context"
import { xmlrpc, XMLRPCRequestHandler } from "lib/xmlrpc"

const { feeds, evt: events } = CourierContext.create()

interface XMLRPCError extends Error {
  faultCode: number
  faultString: string
}

const handler: XMLRPCRequestHandler = async ({ methodName, params }) => {
  const evt = events.push("xmlrpc_request")
  evt.add({
    "xmlrpc.method_name": methodName,
  })

  try {
    if (methodName === "weblogUpdates.ping") {
      const [title, homePageURL] = params
      evt.add({
        "ping.title": title,
        "ping.home_page_url": homePageURL,
      })

      console.log(`Received ping for [${title}](${homePageURL})`)

      await feeds.refreshAllByHomePageURL(homePageURL)

      events.pop()
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
  } catch (err) {
    evt.add({ err: err.message })
    throw err
  } finally {
    events.pop()
    events.flush()
  }
}

export default xmlrpc(handler)

export const config = {
  api: {
    bodyParser: false,
  },
}
