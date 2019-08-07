import React from "react"
import { HttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import { InMemoryCache } from "apollo-cache-inmemory"
import { NextPageContext, NextPage } from "next"
import { getToken } from "../utils/auth0"
import { IncomingMessage } from "http"
import { ApolloProvider } from "@apollo/react-common"
import ApolloClient from "apollo-client"
import { getDataFromTree } from "@apollo/react-ssr"
import Head from "next/head"
import fetch from "isomorphic-unfetch"

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  // @ts-ignore
  global.fetch = fetch
}

const config = (ctx?: NextPageContext) => {
  const req = ctx && ctx.req
  const authLink = setContext((_, { headers }) => {
    const token = getToken(req, "accessToken")
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    }
  })

  const httpLink = new HttpLink({
    uri: apiUrl("/graphql", req),
  })

  return {
    link: authLink.concat(httpLink),
  }
}

let cachedClient: ApolloClient<any> | undefined

function initApollo(cacheData: any, ctx?: NextPageContext): ApolloClient<any> {
  const clientConfig = config(ctx)

  function create() {
    return new ApolloClient({
      connectToDevTools: process.browser,
      ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
      cache: new InMemoryCache().restore(cacheData || {}),
      ...clientConfig,
    })
  }

  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create()
  }

  // Reuse client on the client-side
  if (!cachedClient) {
    cachedClient = create()
  }

  return cachedClient
}

function withData<P>(Page: NextPage<P>): NextPage<any, any> {
  const dataPage: NextPage<any, any> = ({ apolloCache, ...props }) => {
    const clientRef = React.useRef<ApolloClient<any> | null>(null)
    if (clientRef.current === null) {
      clientRef.current = initApollo(apolloCache)
    }

    return (
      <ApolloProvider client={clientRef.current}>
        <Page {...props} />
      </ApolloProvider>
    )
  }

  dataPage.getInitialProps = async ctx => {
    let apolloCache = {}

    // @ts-ignore
    let composedInitialProps: P = {}
    if (Page.getInitialProps) {
      composedInitialProps = await Page.getInitialProps(ctx)
    }

    // Run all GraphQL queries in the component tree
    // and extract the resulting data
    if (!process.browser) {
      let apollo = initApollo(null, ctx)

      try {
        // Run all GraphQL queries
        await getDataFromTree(
          <ApolloProvider client={apollo}>
            <Page {...composedInitialProps} />
          </ApolloProvider>
        )
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
        console.error(error)
      }
      // getDataFromTree does not call componentWillUnmount
      // head side effect therefore need to be cleared manually
      Head.rewind()

      // Extract query data from the Apollo store
      apolloCache = apollo.cache.extract()
    }

    return {
      apolloCache,
      ...composedInitialProps,
    }
  }

  return dataPage
}

export default withData

function apiUrl(path: string, req: IncomingMessage | undefined) {
  if (req && typeof window === "undefined") {
    // this is running server-side, so we need an absolute URL
    const host = req.headers.host
    if (host && host.startsWith("localhost")) {
      return `http://localhost:3000${path}`
    } else {
      return `https://${host}${path}`
    }
  } else {
    // this is running client-side, so a relative path is fine
    return path
  }
}
