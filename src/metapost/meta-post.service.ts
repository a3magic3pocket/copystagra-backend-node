import { Injectable } from "@nestjs/common";
import { MetaPost } from "./schema/meta-post.schema";

@Injectable()
export class MetaPostService {
  constructor() {}

  async countNumLikes(postId: string, hookPostId: string, numLikes: number) {
    const numReplies = 0;
    const numViews = 0;
    const metaPost = new MetaPost(
      postId,
      hookPostId,
      numLikes,
      numReplies,
      numViews
    );
  }

  async upNumLikes(postId: string, hookPostId: string) {
    const numLikes = 1;
    return this.countNumLikes(postId, hookPostId, numLikes);
  }
}
