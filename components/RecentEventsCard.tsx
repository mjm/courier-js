import React from "react"
import { graphql } from "react-relay"
import { useFragment } from "react-relay/hooks"

import { RecentEventsCard_events$key } from "@generated/RecentEventsCard_events.graphql"
import EventTableRow from "components/EventTableRow"

const RecentEventsCard: React.FC<{
  events: RecentEventsCard_events$key
}> = props => {
  const events = useFragment(
    graphql`
      fragment RecentEventsCard_events on Query {
        allEvents(first: 10) @connection(key: "RecentEventsCard_allEvents") {
          edges {
            node {
              id
              ...EventTableRow_event
            }
          }
        }
      }
    `,
    props.events
  )

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
      {events.allEvents.edges.map(({ node }) => (
        <EventTableRow key={node.id} event={node} />
      ))}
    </div>
  )
}

export default RecentEventsCard
