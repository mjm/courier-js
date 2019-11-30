import Card, { CardHeader } from "./Card"
import { createFragmentContainer, graphql } from "react-relay"
import { RecentEventsCard_events } from "../lib/__generated__/RecentEventsCard_events.graphql"
import EventTableRow from "./EventTableRow"
import InfoTable from "./InfoTable"

interface Props {
  events: RecentEventsCard_events
}

const RecentEventsCard: React.FC<Props> = ({ events }) => {
  return (
    <Card>
      <CardHeader>Recent Activity</CardHeader>
      <InfoTable>
        <colgroup>
          <col />
          <col css={{ width: "150px" }} />
        </colgroup>
        <tbody>
          {events.allEvents.edges.map(({ node }) => (
            <EventTableRow key={node.id} event={node} />
          ))}
        </tbody>
      </InfoTable>
    </Card>
  )
}

export default createFragmentContainer(RecentEventsCard, {
  events: graphql`
    fragment RecentEventsCard_events on Query {
      allEvents(first: 15) @connection(key: "RecentEventsCard_allEvents") {
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
