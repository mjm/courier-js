import DataLoader from "dataloader"
import { PostId, Post } from "../data/types"
import { getPostsById } from "../data/post"

export function postLoader(): DataLoader<PostId, Post | null> {
  return new DataLoader(async ids => {
    return await getPostsById(ids)
  })
}
