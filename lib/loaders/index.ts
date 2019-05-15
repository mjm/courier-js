import { feedLoader } from "./feed"

export function createLoaders() {
  return {
    feeds: feedLoader(),
  }
}

export type Loaders = ReturnType<typeof createLoaders>
