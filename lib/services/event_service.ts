import { injectable, inject } from "inversify"
import EventRepository from "../repositories/event_repository"
import { Event, EventType, PagingOptions } from "../data/types"
import { UserIdProvider } from "./user_service"
import * as keys from "../key"
import { Pager } from "../data/pager"

@injectable()
class EventService {
  constructor(
    @inject(keys.UserId) private getUserId: UserIdProvider,
    private events: EventRepository
  ) {}

  async paged(options: PagingOptions = {}): Promise<Pager<Event>> {
    return this.events.paged(await this.getUserId(), options)
  }

  async record(eventType: EventType, parameters: Object = {}): Promise<Event> {
    const userId = await this.getUserId().catch(() => null)
    return await this.events.create(userId, { eventType, parameters })
  }
}

export default EventService
