import { sql, DatabasePoolType } from "../db"
import { injectable, inject } from "inversify"
import { DB } from "../key"
import * as table from "../data/dbTypes"
import { Event, UserId, NewEventInput } from "../data/types"

@injectable()
class EventRepository {
  constructor(@inject(DB) private db: DatabasePoolType) {}

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

export default EventRepository
