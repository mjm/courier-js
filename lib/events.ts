import * as os from "os"

import { injectable, interfaces } from "inversify"
import Libhoney, { Builder, Event } from "libhoney"
import uuid from "uuid"

import Environment from "lib/env"

export function createHoney(context: interfaces.Context): Libhoney {
  const env = context.container.get(Environment)
  return new Libhoney({
    writeKey: env.honey.writeKey,
    dataset: env.honey.dataset,
  })
}

export enum EventKeys {
  NodeVersion = "meta.node_version",
  LocalHostname = "meta.local_hostname",
  Environment = "meta.env",
  Duration = "duration_ms",
  TraceId = "trace.trace_id",
  TraceParentId = "trace.parent_id",
  TraceSpanId = "trace.span_id",
  ServiceName = "service_name",
  SpanName = "name",

  AuthApiIdentifier = "auth.api_identifier",
}

@injectable()
export class EventContext {
  private builder: Builder
  private eventStack: Event[]

  constructor(env: Environment, private honey: Libhoney) {
    this.builder = this.honey.newBuilder({
      [EventKeys.NodeVersion]: process.version,
      [EventKeys.LocalHostname]: os.hostname(),
      [EventKeys.Environment]: process.env.NODE_ENV,
      [EventKeys.ServiceName]: "courier",
      [EventKeys.AuthApiIdentifier]: env.apiIdentifier,
    })
    this.eventStack = []
  }

  get root(): Event {
    return this.eventStack[0]
  }

  get current(): Event {
    return this.eventStack[this.eventStack.length - 1]
  }

  push(name: string): Event {
    const parent = this.eventStack.length > 0 ? this.current : undefined
    const evt = this._makeEvent(parent)
    evt.timestamp = new Date()
    evt.addField(EventKeys.SpanName, name)
    this.eventStack.push(evt)
    return evt
  }

  pop(): void {
    const evt = this.eventStack.pop()
    if (!evt) {
      throw new Error("Tried to pop event when there was none on the stack.")
    }

    evt.addField(
      EventKeys.Duration,
      evt.timestamp ? Date.now() - evt.timestamp.getTime() : null
    )
    evt.send()
  }

  private _makeEvent(parent?: Event): Event {
    const evt = this.builder.newEvent()
    if (parent) {
      evt.add({
        [EventKeys.TraceId]: parent.data[EventKeys.TraceId],
        [EventKeys.TraceParentId]: parent.data[EventKeys.TraceSpanId],
      })
    } else {
      evt.add({
        [EventKeys.TraceId]: uuid(),
      })
    }
    evt.addField(EventKeys.TraceSpanId, uuid())
    return evt
  }
}
