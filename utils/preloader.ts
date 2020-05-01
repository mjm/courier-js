import TweetsPageQuery from "@generated/TweetsPageQuery.graphql"
import FeedsPageQuery from "@generated/FeedsPageQuery.graphql"
import {
  PreloadableConcreteRequest,
  PreloadedQuery,
} from "react-relay/lib/relay-experimental/EntryPointTypes"
import { preloadQuery } from "react-relay/hooks"
import { getEnvironment } from "hocs/withData"
import { NextRouter, useRouter } from "next/router"
import React from "react"
import AccountPageQuery from "@generated/AccountPageQuery.graphql"
import SubscribePageQuery from "@generated/SubscribePageQuery.graphql"
import FeedDetailsPageQuery from "@generated/FeedDetailsPageQuery.graphql"
import { match } from "path-to-regexp"

interface QueryRoute {
  matcher: any
  query: PreloadableConcreteRequest<any>
}

const queries: QueryRoute[] = ([
  ["/tweets", TweetsPageQuery],
  ["/feeds/:id", FeedDetailsPageQuery],
  ["/feeds", FeedsPageQuery],
  ["/account", AccountPageQuery],
  ["/subscribe", SubscribePageQuery],
] as const).map(([pat, q]) => ({
  matcher: match(pat),
  query: q,
}))

class Preloader {
  private cachedQueries = new Map<string, PreloadedQuery<any>>()

  preload(url: string) {
    const match = Preloader.matchRoute(url)
    if (!match) {
      return
    }

    const q = preloadQuery(getEnvironment(), match.query, match.variables, {
      fetchPolicy: "store-and-network",
    })
    this.cachedQueries.set(url, q)
  }

  private static matchRoute(
    url: string
  ): {
    query: PreloadableConcreteRequest<any>
    variables: Record<string, unknown>
  } | null {
    for (const route of queries) {
      const match = route.matcher(url)
      if (match) {
        return { query: route.query, variables: match.params }
      }
    }
    return null
  }

  get(url: string): PreloadedQuery<any> {
    let q = this.cachedQueries.get(url)
    if (q) {
      console.log(`Using stored preloaded query for ${url}`)
      return q
    }

    console.log(`Preloading query for ${url} on-demand`)
    this.preload(url)
    q = this.cachedQueries.get(url)
    if (!q) {
      throw new Error(
        `query preloader does not have a query configured for URL ${url}`
      )
    }
    return q
  }

  observe(router: NextRouter): () => void {
    router.events.on("routeChangeStart", this.handleRouteChangeStart)
    return () => {
      router.events.off("routeChangeStart", this.handleRouteChangeStart)
    }
  }

  handleRouteChangeStart = (url: string): void => {
    console.log(`Preloading query for ${url}`)
    this.preload(url)
  }
}

export const preloader = new Preloader()

export function usePreloader(preloader: Preloader) {
  const router = useRouter()

  React.useEffect(() => {
    return preloader.observe(router)
  }, [preloader])
}
