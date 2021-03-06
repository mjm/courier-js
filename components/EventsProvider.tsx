import React from "react"
import { useRelayEnvironment } from "react-relay/hooks"
import { Environment } from "relay-runtime"

import Pusher, { AuthInfo, Channel } from "pusher-js"
import { AuthData } from "pusher-js/types/src/core/auth/options"

import { useAuth } from "components/AuthProvider"
import { getToken } from "utils/auth0"

const pusher = process.browser
  ? new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY ?? "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true,
      authorizer(channel, _options) {
        async function authorize(socketId: string): Promise<AuthInfo> {
          const response = await fetch(
            process.env.NEXT_PUBLIC_PUSHER_AUTH_URL ?? "",
            {
              method: "POST",
              body: `channel_name=${channel.name}&socket_id=${socketId}`,
              headers: {
                Authorization: `Bearer ${getToken(undefined, "accessToken")}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          )
          return (await response.json()) as AuthData
        }
        return {
          authorize(socketId, callback) {
            authorize(socketId).then(
              info => callback(false, info),
              _err => callback(true, "")
            )
          },
        }
      },
    })
  : null

const EventsContext = React.createContext<{ channel: Channel | undefined }>({
  channel: undefined,
})

export const EventsProvider: React.FC = ({ children }) => {
  const auth = useAuth()

  let channel
  if (auth.user) {
    const channelName = `private-events-${auth.user.sub.replace(/\|/g, "_")}`
    channel = pusher?.subscribe(channelName)
  }

  return (
    <EventsContext.Provider value={{ channel }}>
      {children}
    </EventsContext.Provider>
  )
}

export function useEvent(
  eventName: string,
  handler: Function,
  deps: unknown[]
): void {
  const { channel } = React.useContext(EventsContext)
  React.useEffect(() => {
    if (!channel) {
      return
    }

    channel.bind(eventName, handler)
    return () => {
      channel.unbind(eventName, handler)
    }
  }, deps)
}

export interface EventHandler<T> {
  (environment: Environment, data: T): Promise<void>
}

export interface EventHook {
  (): void
}

export function createEventHook<T>(
  eventName: string,
  handler: EventHandler<T>
): EventHook {
  return () => {
    const environment = useRelayEnvironment()
    useEvent(
      eventName,
      (data: T) => {
        handler(environment, data)
      },
      []
    )
  }
}
