import React from "react"

import Pusher, { Channel } from "pusher-js"

import { useAuth } from "./AuthProvider"

const pusher = new Pusher(process.env.PUSHER_KEY ?? "", {
  cluster: process.env.PUSHER_CLUSTER,
  forceTLS: true,
})

const EventsContext = React.createContext<{ channel: Channel | undefined }>({
  channel: undefined,
})

export const EventsProvider: React.FC = ({ children }) => {
  const auth = useAuth()

  let channel
  if (auth.user) {
    const channelName = `user_events_${auth.user.sub.replace(/\|/g, "_")}`
    channel = pusher.subscribe(channelName)
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
) {
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
