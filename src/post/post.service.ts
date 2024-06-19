import { Injectable } from "@nestjs/common";
import { PostRepostory } from "./post.repository";

@Injectable()
export class PostService {
  constructor(private postRepostiry: PostRepostory) {}

  async getLatestPosts(pageNum: number, pageSize: number, ownerId: string) {
    const skip = (pageNum - 1) * pageSize;
    return await this.postRepostiry.getLatestPostsByUserId(
      skip,
      pageSize,
      ownerId
    );
  }

  async countPostsByUserId(ownerId: string) {
    return await this.postRepostiry.countPostsByUserId(ownerId);
  }
}
