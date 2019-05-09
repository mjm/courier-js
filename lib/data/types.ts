import { CachingHeaders } from "scrape-feed"

export interface Feed {
  id: string
  url: string
  title: string
  homePageURL: string
  cachingHeaders: CachingHeaders | null
}

export interface FeedInput {
  url: string
}
