import PostRepository from "../repositories/post_repository"
import { FeedId, PagingOptions, Post } from "../data/types"
import { Pager } from "../data/pager"
import { injectable } from "inversify"
import { posts } from "lib/data/dbTypes"

@injectable()
class PostService {
  constructor(private posts: PostRepository) {}

  pagedByFeed(feedId: FeedId, options: PagingOptions = {}): Pager<Post, posts> {
    return this.posts.pagedByFeed(feedId, options)
  }
}

export default PostService
