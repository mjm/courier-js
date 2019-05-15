import DataLoader from "dataloader"
import { FeedId, Feed } from "../data/types"
import { getFeedsById } from "../data/feed"

export function feedLoader(): DataLoader<FeedId, Feed | null> {
  return new DataLoader(async id => {
    return await getFeedsById(id)
  })
}
