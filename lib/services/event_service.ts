import { inject,injectable } from "inversify"

import { events } from "lib/data/dbTypes"

import { Pager } from "../data/pager"
import {
  Event,
  EventParameters,
  EventType,
  PagingOptions,
  UserId,
} from "../data/types"
import * as keys from "../key"
import EventRepository from "../repositories/event_repository"

interface RecordOptions {
  asUser?: UserId | null
}

@injectable()
class EventService {
  constructor(
    @inject(keys.UserId) private getUserId: () => Promise<UserId>,
    private events: EventRepository
  ) {}

  async paged(options: PagingOptions = {}): Promise<Pager<Event, events>> {
    return this.events.paged(await this.getUserId(), options)
  }

  async record(
    eventType: EventType,
    parameters: EventParameters = {},
    options: RecordOptions = {}
  ): Promise<Event> {
    const userId = options.asUser || (await this.getUserId().catch(() => null))
    return await this.events.create(userId, { eventType, parameters })
  }
}

export default EventService
