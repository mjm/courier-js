import { injectable, inject } from "inversify"
import EventRepository from "../repositories/event_repository"
import { Event, EventType } from "../data/types"
import { UserIdProvider } from "./user_service"
import * as keys from "../key"

@injectable()
class EventService {
  constructor(
    @inject(keys.UserId) private getUserId: UserIdProvider,
    private events: EventRepository
  ) {}

  async record(eventType: EventType, parameters: Object = {}): Promise<Event> {
    const userId = await this.getUserId().catch(() => null)
    return await this.events.create(userId, { eventType, parameters })
  }
}

export default EventService
