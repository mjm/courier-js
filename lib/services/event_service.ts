import { injectable, inject } from "inversify"
import EventRepository from "../repositories/event_repository"
import { Event, EventType, PagingOptions, UserId } from "../data/types"
import { UserIdProvider } from "./user_service"
import * as keys from "../key"
import { Pager } from "../data/pager"

interface RecordOptions {
  asUser?: UserId | null
}

@injectable()
class EventService {
  constructor(
    @inject(keys.UserId) private getUserId: UserIdProvider,
    private events: EventRepository
  ) {}

  async paged(options: PagingOptions = {}): Promise<Pager<Event>> {
    return this.events.paged(await this.getUserId(), options)
  }

  async record(
    eventType: EventType,
    parameters: Object = {},
    options: RecordOptions = {}
  ): Promise<Event> {
    const userId = options.asUser || (await this.getUserId().catch(() => null))
    return await this.events.create(userId, { eventType, parameters })
  }
}

export default EventService
