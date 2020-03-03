import React from "react"
import { Provider } from "react-redux"

import { NextPage } from "next"
import dynamic from "next/dynamic"

import { PlaygroundWrapperProps } from "graphql-playground-react/lib/components/PlaygroundWrapper"

const Graphql = dynamic<PlaygroundWrapperProps>(
  () =>
    import("graphql-playground-react").then(mod => {
      const { Playground, store } = mod
      return props => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Provider store={store as any}>
          <Playground {...props} />
        </Provider>
      )
    }),
  { ssr: false }
)

const PlaygroundPage: NextPage = () => {
  return (
    <Graphql
      endpoint={process.env.GRAPHQL_URL}
      settings={{
        "editor.cursorShape": "line", // possible values: 'line', 'block', 'underline'
        "editor.fontFamily": `'JetBrains Mono', 'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
        "editor.fontSize": 13,
        "editor.reuseHeaders": true, // new tab reuses headers from last tab
        "editor.theme": "light", // possible values: 'dark', 'light'
        "general.betaUpdates": false,
        "prettier.printWidth": 80,
        "prettier.tabWidth": 2,
        "prettier.useTabs": false,
        "request.credentials": "include",
        "schema.polling.enable": false,
        "schema.polling.endpointFilter": "*a-fake-url*", // endpoint filter for schema polling
        "schema.polling.interval": 2000, // schema polling interval in ms
        "schema.disableComments": false,
        "tracing.hideTracingResponse": true,
      }}
    />
  )
}

export default PlaygroundPage
