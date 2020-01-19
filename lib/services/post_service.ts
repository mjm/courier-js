import { injectable } from "inversify"

import { posts } from "lib/data/dbTypes"

import { Pager } from "../data/pager"
import { FeedId, PagingOptions, Post } from "../data/types"
import PostRepository from "../repositories/post_repository"

@injectable()
class PostService {
  constructor(private posts: PostRepository) {}

  pagedByFeed(feedId: FeedId, options: PagingOptions = {}): Pager<Post, posts> {
    return this.posts.pagedByFeed(feedId, options)
  }
}

export default PostService
