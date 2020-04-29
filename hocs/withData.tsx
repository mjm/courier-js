import React from "react"
import { ReactRelayContext } from "react-relay"
import {
  Environment,
  FetchFunction,
  fetchQuery,
  GraphQLTaggedNode,
  Network,
  Observable,
  OperationType,
  RecordSource,
  Store,
  SubscribeFunction,
} from "relay-runtime"
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes"

import { NextPage, NextPageContext } from "next"
import Router from "next/router"

import { IncomingMessage } from "http"

import fetch from "isomorphic-unfetch"

import { getToken } from "utils/auth0"

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
    queryRecords: RecordMap
  },
  IP & {
    queryRecords: RecordMap
  }
>

function withData<
  Operation extends OperationType,
  P extends Operation["response"] & {},
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
    let composedInitialProps = {}
    if (Page.getInitialProps) {
      composedInitialProps = await Page.getInitialProps(ctx)
    }

    let queryProps: Operation["response"] = {}
    let queryRecords: RecordMap = {}
    const environment = initEnvironment(ctx)

    if (options.query) {
      let variables = {}
      if (options.getVariables) {
        variables = options.getVariables(composedInitialProps as IP)
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
            inner.extensions.code === "PermissionDenied"
          ) {
            // redirect auth errors to the login page
            if (ctx.res) {
              ctx.res.writeHead(302, { Location: "/login" })
              ctx.res.end()
            } else {
              Router.push("/login")
            }
            return {
              ...(composedInitialProps as IP),
              queryRecords,
            }
          }
        }

        throw err
      }
    }

    return {
      ...(composedInitialProps as IP),
      ...(queryProps as {}),
      queryRecords,
    }
  }

  return dataPage
}

export default withData

function makeFetchQuery(ctx?: NextPageContext): FetchFunction {
  if (!ctx && !process.browser) {
    return () => new Promise(() => {})
  }

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

function makeFetchSubscription(ctx?: NextPageContext): SubscribeFunction {
  const req = ctx && ctx.req
  const url = apiUrl("/api/graphql", req)

  return (operation, variables, _cacheConfig) => {
    const params = new URLSearchParams()
    params.set("q", operation.text || "")
    params.set("op", operation.name)
    params.set("v", JSON.stringify(variables))

    const eventSource = new EventSource(`${url}?${params.toString()}`, {
      withCredentials: true,
    })
    return Observable.create(sink => {
      eventSource.onerror = err => {
        sink.error(new Error(`Error received from event source: ${err}`))
      }

      eventSource.onmessage = data => {
        sink.next(JSON.parse(data.data))
      }

      return () => {
        eventSource.close()
      }
    })
  }
}

export function initEnvironment(
  ctx?: NextPageContext,
  records?: RecordMap
): Environment {
  const fetchQuery = makeFetchQuery(ctx)
  const fetchSubscription = makeFetchSubscription(ctx)
  const network = Network.create(fetchQuery, fetchSubscription)
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

export function getEnvironment(): Environment {
  if (!relayEnvironment) {
    relayEnvironment = new Environment({
      network: Network.create(makeFetchQuery()),
      store: new Store(new RecordSource()),
    })
  }
  return relayEnvironment
}

function apiUrl(path: string, req: IncomingMessage | undefined): string {
  if (process.env.GRAPHQL_URL) {
    return process.env.GRAPHQL_URL
  }
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
