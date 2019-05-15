import { feedLoader } from "./feed"
import { postLoader } from "./post"

export function createLoaders() {
  return {
    feeds: feedLoader(),
    posts: postLoader(),
  }
}

export type Loaders = ReturnType<typeof createLoaders>
