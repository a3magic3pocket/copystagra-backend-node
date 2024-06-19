import { Injectable } from "@nestjs/common";
import { PostRepostory } from "./post.repository";

@Injectable()
export class PostService {
  constructor(private postRepostiry: PostRepostory) {}

  async getRelatedAllPosts(
    pageNum: number,
    pageSize: number,
    hookPostId: string
  ) {
    const skip = (pageNum - 1) * pageSize;
    return await this.postRepostiry.getRelatedAllPosts(
      skip,
      pageSize,
      hookPostId
    );
  }

  async getLatestAllPosts(pageNum: number, pageSize: number) {
    const skip = (pageNum - 1) * pageSize;
    return await this.postRepostiry.getLatestAllPosts(skip, pageSize);
  }

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
