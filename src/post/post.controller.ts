import {
  Controller,
  Get,
  Query,
  Session,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { IAuthSession } from "src/login/interface/auth-session.interface";
import { LoginGuard } from "src/login/login.guard";
import { PostService } from "./post.service";
import { IPostCountDto } from "./interface/post-count-dto.interface";
import { CommonListQueryDto } from "src/global/dto/common-list-query.dto";
import { IPostsRespDto } from "./interface/posts-resp-dto.interface";
import { RelatedPostsListQueryDto } from "./dto/related-posts-list-query.dto";
import { PostRepostory } from "./post.repository";
import { IErrorRespDto } from "src/global/dto/interface/error-resp-dto.interface";
import { KafkaProducerService } from "src/global/kafka/kafka.producer.service";
import { KafkaConsumerService } from "src/global/kafka/kafka.consumer.service";

@Controller()
export class PostController {
  constructor(
    private postRepository: PostRepostory,
    private postService: PostService,
    private kafkaProducerService: KafkaProducerService,
    private kafkaConsumerService: KafkaConsumerService
  ) {
    this.kafkaConsumerService.subscribe("test-topic", this.hello);
  }

  @Get("/kafka/produce")
  async kafkaTest() {
    await this.kafkaProducerService.sendMessage(
      "test-topic",
      "key",
      JSON.stringify({ a: "hello-world" })
    );
  }

  hello(message) {
    console.log("kafka message arrived");
    console.log("message", message);
    console.log("message.partition", message.partition);
    console.log("message.offset", message.offset);
    return true;
  }

  @Get("/v1/posts")
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
