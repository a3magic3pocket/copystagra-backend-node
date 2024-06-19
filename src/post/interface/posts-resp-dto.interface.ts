import { PostRespDto } from "../dto/post-resp.dto";

export interface IPostsRespDto {
  pageNum: number;
  pageSize: number;
  posts: PostRespDto[];
}
