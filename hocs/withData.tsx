import React from "react"

import {
  FetchFunction,
  Environment,
  Network,
  Store,
  RecordSource,
  fetchQuery,
  GraphQLTaggedNode,
  OperationType,
} from "relay-runtime"
import { ReactRelayContext } from "react-relay"
import fetch from "isomorphic-unfetch"
import { IncomingMessage } from "http"
import { NextPageContext, NextPage } from "next"
import { getToken } from "../utils/auth0"
import Router from "next/router"

let relayEnvironment: Environment | null = null

interface WithDataOptions<Props, Operation extends OperationType> {
  query?: GraphQLTaggedNode
  getVariables?: (props: Props) => Operation["variables"]
}

type WithDataWrapped<P, IP> = NextPage<
  P & {
    environment?: Environment
  },
  IP
>

type DataPage<P, IP> = NextPage<
  P & {
    queryRecords: any
  },
  IP & {
    queryRecords: any
  }
>

function withData<
  Operation extends OperationType,
  P extends Operation["response"] & Object,
  IP = P
>(
  Page: WithDataWrapped<P, IP>,
  options: WithDataOptions<IP, Operation> = {}
): DataPage<P, IP> {
  const dataPage: DataPage<P, IP> = props => {
    const environmentRef = React.useRef<Environment | null>(null)
    if (environmentRef.current === null) {
      environmentRef.current = initEnvironment(undefined, props.queryRecords)
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
    let composedInitialProps: IP = {}
    if (Page.getInitialProps) {
      composedInitialProps = await Page.getInitialProps(ctx)
    }

    let queryProps: any = {}
    let queryRecords: any = {}
    const environment = initEnvironment(ctx)

    if (options.query) {
      let variables = {}
      if (options.getVariables) {
        variables = options.getVariables(composedInitialProps)
      }

      try {
        queryProps = await fetchQuery<Operation>(
          environment,
          options.query,
          variables
        )
        queryRecords = environment
          .getStore()
          .getSource()
          .toJSON()
      } catch (err) {
        if (err.name === "RelayNetwork") {
          const inner = err.source.errors[0]
          if (
            inner &&
            inner.extensions &&
            inner.extensions.code === "UNAUTHENTICATED"
          ) {
            // redirect auth errors to the login page
            if (ctx.res) {
              ctx.res.writeHead(302, { Location: "/login" })
              ctx.res.end()
            } else {
              Router.push("/login")
            }
          }
        }
      }
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
  const url = apiUrl("/api/graphql", req)

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
    const json = await response.json()
    if (json && json.errors) {
      return { ...json, data: null }
    }
    return json
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
