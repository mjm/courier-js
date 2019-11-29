import React from "react"

import {
  FetchFunction,
  Environment,
  Network,
  Store,
  RecordSource,
  fetchQuery,
  GraphQLTaggedNode,
} from "relay-runtime"
import { ReactRelayContext } from "react-relay"
import fetch from "isomorphic-unfetch"
import { IncomingMessage } from "http"
import { NextPageContext, NextPage } from "next"
import { getToken } from "../utils/auth0"

let relayEnvironment: Environment | null = null

interface WithDataOptions {
  query?: GraphQLTaggedNode
}

function withData<P>(
  Page: NextPage<P>,
  options: WithDataOptions = {}
): NextPage<P> {
  const dataPage: NextPage<any, any> = ({ queryRecords, ...props }) => {
    const environmentRef = React.useRef<Environment | null>(null)
    if (environmentRef.current === null) {
      environmentRef.current = initEnvironment(undefined, queryRecords)
    }

    return (
      <ReactRelayContext.Provider
        value={
          environmentRef.current
            ? { environment: environmentRef.current }
            : null
        }
      >
        <Page {...props} environment={environmentRef.current} />
      </ReactRelayContext.Provider>
    )
  }

  dataPage.getInitialProps = async ctx => {
    // @ts-ignore
    let composedInitialProps: P = {}
    if (Page.getInitialProps) {
      composedInitialProps = await Page.getInitialProps(ctx)
    }

    let queryProps: any = {}
    let queryRecords: any = {}
    const environment = initEnvironment(ctx)

    if (options.query) {
      const variables = {}
      queryProps = await fetchQuery(environment, options.query, variables)
      queryRecords = environment
        .getStore()
        .getSource()
        .toJSON()
    }

    return {
      ...composedInitialProps,
      ...queryProps,
      queryRecords,
    }
  }

  return dataPage
}

export default withData

function makeFetchQuery(ctx?: NextPageContext): FetchFunction {
  const req = ctx && ctx.req
  const url = apiUrl("/graphql", req)

  return async (operation, variables, _cacheConfig, _uploadables) => {
    const token = getToken(req, "accessToken")
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    })
    return await response.json()
  }
}

function initEnvironment(ctx?: NextPageContext, records?: any): Environment {
  const fetchQuery = makeFetchQuery(ctx)
  const network = Network.create(fetchQuery)
  const store = new Store(new RecordSource(records))

  if (!process.browser) {
    return new Environment({
      network,
      store,
    })
  }

  if (!relayEnvironment) {
    relayEnvironment = new Environment({
      network,
      store,
    })
  }

  return relayEnvironment
}

function apiUrl(path: string, req: IncomingMessage | undefined): string {
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
