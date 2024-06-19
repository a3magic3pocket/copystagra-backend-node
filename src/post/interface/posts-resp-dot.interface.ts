import { Post } from "../schema/post.schema";

export interface IPostsRespDto {
  pageNum: number;
  pageSize: number;
  posts: Post[];
}
