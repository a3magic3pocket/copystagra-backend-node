import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  Session,
  UseGuards,
} from "@nestjs/common";
import { IAuthSession } from "src/login/interface/auth-session.interface";
import { LoginGuard } from "src/login/login.guard";
import { PostService } from "./post.service";
import { IPostCountDto } from "./interface/post-count-dto.interface";
import { CommonListQueryDto } from "src/global/dto/common-list-query.dto";
import { IPostsRespDto } from "./interface/posts-resp-dot.interface";

@Controller()
export class PostController {
  constructor(private postService: PostService) {}

  @Get("/v1/my-posts/")
  @UseGuards(LoginGuard)
  async listMyPosts(
    @Session() session: IAuthSession,
    @Query() query: CommonListQueryDto
  ) {
    let pageNum = query.pageNum ? query.pageNum : 1;
    let pageSize = 9;
    const posts = await this.postService.getLatestPosts(
      pageNum,
      pageSize,
      session.user.sub
    );
    const postsRespDto: IPostsRespDto = {
      pageNum: pageNum,
      pageSize: posts.length,
      posts: posts,
    };

    return postsRespDto;
  }

  @Get("/v1/my-posts/count")
  @UseGuards(LoginGuard)
  async countMyPosts(@Session() session: IAuthSession) {
    const countMyPosts = await this.postService.countPostsByUserId(
      session.user.sub
    );
    const postCountDto: IPostCountDto = {
      count: countMyPosts,
    };

    return postCountDto;
  }
}
