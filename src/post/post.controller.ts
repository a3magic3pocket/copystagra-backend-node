import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Session,
  UnprocessableEntityException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { IAuthSession } from "@src/login/interface/auth-session.interface";
import { LoginGuard } from "@src/login/login.guard";
import { PostService } from "./post.service";
import { IPostCountDto } from "./interface/post-count-dto.interface";
import { CommonListQueryDto } from "@src/global/dto/common-list-query.dto";
import { IPostsRespDto } from "./interface/posts-resp-dto.interface";
import { RelatedPostsListQueryDto } from "./dto/related-posts-list-query.dto";
import { PostRepository } from "./post.repository";
import { IErrorRespDto } from "@src/global/dto/interface/error-resp-dto.interface";
import { FilesInterceptor, NoFilesInterceptor } from "@nestjs/platform-express";
import { PostCreateBodyDto } from "./dto/post-create-body.dto";
import { IPostCreateDto } from "./interface/post-create-dto.interface";
import { IPostCreateImageDto } from "./interface/post-create-image-dto.interface";
import { ISimpleSuccessRespDto } from "@src/global/dto/interface/simple-success-resp-dto.interface";
import { PostClickCountBodyDto } from "./dto/post-click-count-body.dto";
import { PostCreateBodyForSwaggerDto } from "./dto/post-create-body-for-swagger.dto";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("post")
@Controller()
export class PostController {
  constructor(
    private postRepository: PostRepository,
    private postService: PostService
  ) {}

  @Post("/v1/post")
  @ApiOperation({ summary: "포스트 생성" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "파일 정보 업로드",
    type: PostCreateBodyForSwaggerDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "생성 성공",
  })
  @UseGuards(LoginGuard)
  @UseInterceptors(FilesInterceptor("image"))
  async createPost(
    @Session() session: IAuthSession,
    @UploadedFiles() imageFiles: Array<Express.Multer.File>,
    @Body() body: PostCreateBodyDto
  ) {
    const allowedExts = new Set(["image/png", "image/jpg", "image/jpeg"]);
    if (imageFiles.length === 0) {
      // 자바 코드 호환을 위한 에러처리
      throw new UnprocessableEntityException(
        "이미지 파일을 1개 이상 추가해야 합니다."
      );
    }

    const imageList: IPostCreateImageDto[] = [];
    for (const imageFile of imageFiles) {
      if (!allowedExts.has(imageFile.mimetype)) {
        // 자바 코드 호환을 위한 에러처리
        throw new UnprocessableEntityException(
          `허가되지 않은 파일이 포함되어있습니다. 허용된 파일 확장자: ${Array.from(allowedExts).join(", ")}`
        );
      }
      const postCreateImageDto: IPostCreateImageDto = {
        imageBytes: imageFile.buffer,
        originalFilename: crypto.randomUUID(),
      };

      imageList.push(postCreateImageDto);
    }

    const postCreateDto: IPostCreateDto = {
      description: body.description,
      ownerId: session.user.sub,
      imageList: imageList,
    };

    this.postService.createPost(postCreateDto);

    const result: ISimpleSuccessRespDto = {
      message: "success",
    };

    return result;
  }

  @Get("/v1/posts")
  @ApiOperation({ summary: "모든 포스트 조회" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "조회 성공",
  })
  async listPosts(@Query() query: CommonListQueryDto) {
    let pageNum = query.pageNum ? query.pageNum : 1;
    let pageSize = 9;
    const posts = await this.postService.getLatestAllPosts(pageNum, pageSize);

    const postsRespDto: IPostsRespDto = {
      pageNum: pageNum,
      pageSize: posts.length,
      posts: posts,
    };

    return postsRespDto;
  }

  @Get("/v1/related-posts")
  @ApiOperation({ summary: "관련 포스트 조회" })
  @ApiQuery({
    name: "hook-post-id",
    type: "string",
    description: "관련 포스트 id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "조회 성공",
  })
  async listRelatedPosts(@Query() query: RelatedPostsListQueryDto) {
    let pageNum = query.pageNum ? query.pageNum : 1;
    let pageSize = 9;
    const hookPostId = query.hookPostId;
    const errorRespDto: IErrorRespDto = {
      code: "9999",
      locale: "ko",
      message: "없는 post 입니다",
    };

    const exists = await this.postRepository.existsById(hookPostId);
    if (!exists) {
      throw new UnprocessableEntityException(errorRespDto);
    }

    const posts = await this.postService.getRelatedAllPosts(
      pageNum,
      pageSize,
      hookPostId
    );
    const postsRespDto: IPostsRespDto = {
      pageNum: pageNum,
      pageSize: posts.length,
      posts: posts,
    };

    return postsRespDto;
  }

  @Get("/v1/my-posts/")
  @ApiOperation({ summary: "내 포스트 조회" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "조회 성공",
  })
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
  @ApiOperation({ summary: "내 포스트 수 조회" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "조회 성공",
  })
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

  @Post("/v1/post/click-count")
  @ApiOperation({
    summary: "포스트 클릭 수 갱신",
    description: "!주의 - kafkajs에서 kafka streams를 미지원하여 기능 미구현",
  })
  @ApiBody({ description: "postId", type: PostClickCountBodyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "갱신 성공",
  })
  @UseInterceptors(NoFilesInterceptor())
  async countPostListNumClicks(
    @Body() postClickCountBodyDto: PostClickCountBodyDto
  ) {
    // !주의 - kafkajs에서 kafka streams를 미지원하여 기능 미구현

    const result: ISimpleSuccessRespDto = {
      message: "success",
    };

    return result;
  }
}
