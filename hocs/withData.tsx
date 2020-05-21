import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
} from "relay-runtime"

import fetch from "isomorphic-unfetch"

import { getToken } from "utils/auth0"

let relayEnvironment: Environment | null = null

function makeFetchQuery(): FetchFunction {
  if (!process.browser) {
    return () => new Promise(() => {})
  }

  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL || ""

  return async (operation, variables) => {
    const token = getToken(undefined, "accessToken")
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

export function getEnvironment(): Environment {
  if (!relayEnvironment) {
    relayEnvironment = new Environment({
      network: Network.create(makeFetchQuery()),
      store: new Store(new RecordSource()),
    })
  }
  return relayEnvironment
}
