import { postLoader } from "./post"

export function createLoaders() {
  return {
    posts: postLoader(),
  }
}

export type Loaders = ReturnType<typeof createLoaders>
