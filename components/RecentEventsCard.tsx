import { createFragmentContainer, graphql } from "react-relay"

import { RecentEventsCard_events } from "@generated/RecentEventsCard_events.graphql"
import EventTableRow from "components/EventTableRow"

const RecentEventsCard: React.FC<{
  events: RecentEventsCard_events
}> = ({ events }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
      {events.allEvents.edges.map(({ node }) => (
        <EventTableRow key={node.id} event={node} />
      ))}
    </div>
  )
}

export default createFragmentContainer(RecentEventsCard, {
  events: graphql`
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
})
