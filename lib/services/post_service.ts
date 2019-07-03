import PostRepository from "../repositories/post_repository"
import { FeedId, PagingOptions, Post } from "../data/types"
import { Pager } from "../data/pager"

class PostService {
  constructor(private posts: PostRepository) {}

  pagedByFeed(feedId: FeedId, options: PagingOptions = {}): Pager<Post, any> {
    return this.posts.pagedByFeed(feedId, options)
  }
}

export default PostService
