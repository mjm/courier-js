import micro from "../lib/micro"
import { xmlrpc, XMLRPCRequestHandler } from "../lib/xmlrpc"
import { getFeedsByHomePageURL, refreshFeed } from "../lib/data/feed"

const handler: XMLRPCRequestHandler = async ({ methodName, params }) => {
  if (methodName === "weblogUpdates.ping") {
    const [title, homePageURL] = params
    console.log(`Received ping for [${title}](${homePageURL})`)

    const feeds = await getFeedsByHomePageURL(homePageURL)
    await Promise.all(
      feeds.map(async feed => {
        await refreshFeed(feed.id)
      })
    )

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
