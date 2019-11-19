import { injectable } from "inversify"
import Environment from "./env"
import * as http2 from "http2"

const pushCert = require("buffer-loader!../certs/courier-push.p12")

const { HTTP2_HEADER_PATH, HTTP2_HEADER_METHOD } = http2.constants

export interface Notification {
  title: LocalizableAlertString
  subtitle?: LocalizableAlertString
  body: LocalizableAlertString

  sound?: string

  threadId?: string
  category?: string

  appData?: Record<string, any>

  topic: string
  pushType?: string
  expireAt?: Date
  collapseId?: string
}

export type LocalizableAlertString =
  | string
  | {
      key: string
      args?: string[]
    }

interface NotificationPayload {
  aps: NotificationApsPayload
  [key: string]: any
}

interface NotificationApsPayload {
  alert?: NotificationAlertPayload
  badge?: number
  sound?: string // could be dictionary for critical alerts
  "thread-id"?: string
  category?: string
  "content-available"?: number
  "mutable-content"?: number
  "target-content-id"?: string
}

interface NotificationAlertPayload {
  title?: string
  subtitle?: string
  body?: string
  "launch-image"?: string

  "title-loc-key"?: string
  "title-loc-args"?: string[]
  "subtitle-loc-key"?: string
  "subtitle-loc-args"?: string[]
  "loc-key"?: string
  "loc-args"?: string[]
}

@injectable()
class PushNotificationProvider {
  private _session?: http2.ClientHttp2Session

  constructor(private env: Environment) {}

  async deliver(tokens: string[], note: Notification): Promise<void> {
    const serializedPayload = JSON.stringify(this.createPayload(note))
    await Promise.all(
      tokens.map(token => this.deliverSingle(token, note, serializedPayload))
    )
  }

  private async deliverSingle(
    token: string,
    note: Notification,
    payload: string
  ): Promise<void> {
    const headers = this.createHeaders(token, note)

    return new Promise((resolve, reject) => {
      const req = this.session.request(headers)

      const chunks: string[] = []

      req.on("data", chunk => {
        chunks.push(chunk)
      })

      req.on("end", () => {
        resolve()
      })

      req.on("error", err => {
        reject(err)
      })

      req.setEncoding("utf8")
      req.write(payload)
      req.end()
    })
  }

  private createHeaders(
    token: string,
    note: Notification
  ): http2.OutgoingHttpHeaders {
    const headers: http2.OutgoingHttpHeaders = {
      [HTTP2_HEADER_METHOD]: "POST",
      [HTTP2_HEADER_PATH]: `/3/device/${token}`,
      "apns-topic": note.topic,
      "apns-push-type": note.pushType || "alert",
    }

    if (note.expireAt) {
      headers["apns-expiration"] = Math.round(note.expireAt.getTime() / 1000)
    }

    if (note.collapseId) {
      headers["apns-collapse-id"] = note.collapseId
    }

    return headers
  }

  private createPayload(note: Notification): NotificationPayload {
    const payload: NotificationPayload = {
      aps: {
        alert: this.createAlert(note),
      },
      ...(note.appData || {}),
    }

    if (note.sound) {
      payload.aps.sound = note.sound
    }

    if (note.threadId) {
      payload.aps["thread-id"] = note.threadId
    }

    if (note.category) {
      payload.aps["category"] = note.category
    }

    return payload
  }

  private createAlert(note: Notification): NotificationAlertPayload {
    const payload: NotificationAlertPayload = {}

    if (typeof note.title === "string") {
      payload.title = note.title
    } else {
      payload["title-loc-key"] = note.title.key
      if (note.title.args) {
        payload["title-loc-args"] = note.title.args
      }
    }

    if (note.subtitle) {
      if (typeof note.subtitle === "string") {
        payload.subtitle = note.subtitle
      } else {
        payload["subtitle-loc-key"] = note.subtitle.key
        if (note.subtitle.args) {
          payload["subtitle-loc-args"] = note.subtitle.args
        }
      }
    }

    if (typeof note.body === "string") {
      payload.body = note.body
    } else {
      payload["loc-key"] = note.body.key
      if (note.body.args) {
        payload["loc-args"] = note.body.args
      }
    }

    return payload
  }

  private get session(): http2.ClientHttp2Session {
    if (this._session) {
      return this._session
    }

    const session = http2.connect(this.apnsUrl, {
      pfx: pushCert,
      passphrase: this.env.apns.passphrase,
    })
    session.on("error", err => {
      console.error(err)
    })
    this._session = session
    return session
  }

  private get apnsUrl(): string {
    return this.env.apns.environment === "development"
      ? "https://api.sandbox.push.apple.com:443"
      : "https://api.push.apple.com:443"
  }
}

export default PushNotificationProvider
