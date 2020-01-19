import { inject,injectable } from "inversify"

import { LoaderQueryFn,QueryLoader } from "lib/data/loader"

import * as table from "../data/dbTypes"
import { Pager } from "../data/pager"
import { Event, NewEventInput, PagingOptions,UserId } from "../data/types"
import { DatabasePoolType,sql } from "../db"
import * as keys from "../key"

@injectable()
class EventRepository {
  constructor(@inject(keys.DB) private db: DatabasePoolType) {}

  paged(userId: UserId, options: PagingOptions): Pager<Event, table.events> {
    return new Pager<Event, table.events>({
      db: this.db,
      query: sql`
        SELECT *
          FROM events
         WHERE user_id = ${userId}
      `,
      totalQuery: sql`SELECT COUNT(*) FROM events WHERE user_id = ${userId}`,
      variables: options,
      orderBy: { column: "created_at", direction: "DESC" },
      makeEdge(row) {
        return {
          cursor: row.created_at.toISOString(),
          node: EventRepository.fromRow(row),
        }
      },
      getCursorValue: val => val,
    })
  }

  async create(userId: UserId | null, input: NewEventInput): Promise<Event> {
    const row = await this.db.one(sql<table.events>`
      INSERT INTO events (
        user_id,
        event_type,
        parameters
      ) VALUES (
        ${userId},
        ${input.eventType},
        ${JSON.stringify(input.parameters)}
      ) RETURNING *
    `)

    return EventRepository.fromRow(row)
  }

  static fromRow(row: table.events): Event {
    return {
      id: row.id.toString(),
      userId: row.user_id,
      eventType: row.event_type as Event["eventType"],
      parameters: row.parameters,
      createdAt: row.created_at,
    }
  }
}

@injectable()
export class EventLoader extends QueryLoader<Event, table.events> {
  constructor(
    @inject(keys.DB) db: DatabasePoolType,
    @inject(keys.UserId) private getUserId: () => Promise<UserId>
  ) {
    super(db)
  }

  query: LoaderQueryFn<table.events> = async cond => {
    try {
      const userId = await this.getUserId()
      return sql`SELECT * FROM events WHERE user_id = ${userId} AND ${cond(
        "events"
      )}`
    } catch (_e) {
      return sql`SELECT * FROM events WHERE ${cond("events")}`
    }
  }
  fromRow = EventRepository.fromRow
}

export default EventRepository
