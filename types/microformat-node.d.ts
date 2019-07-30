import { Cheerio } from "cheerio"

interface MicroformatGetOptions {
  html?: string
  node?: Cheerio
  filter?: string[]
  baseUrl?: string
  textFormat?: "whitespacetrimmed" | "normalised"
  dateFormat?: "auto" | "microformats2" | "w3c" | "rfc3339" | "html5"
  add?: any[]
}

interface MicroformatDocument {
  items: MicroformatItem[]
  rels: Record<string, string[]>
  "rel-urls": MicroformatRelUrls
  errors?: string[]
}

interface MicroformatItem {
  type: [string]
  properties: Record<string, any[]>
  children?: MicroformatItem[]
}

interface MicroformatRelUrls {
  [key: string]: MicroformatRelUrl
}

interface MicroformatRelUrl {
  rels: string[]
  text: string
}

export function get(
  options: MicroformatGetOptions,
  callback: (
    err: Error | undefined | null,
    data: MicroformatDocument | undefined | null
  ) => void
)

export function getAsync(
  options: MicroformatGetOptions
): Promise<MicroformatDocument>
