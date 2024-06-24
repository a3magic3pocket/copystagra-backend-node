import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { POST_COLLECTION_NAME, PostSchema } from "./schema/post.schema";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PostRepostory } from "./post.repository";
import { KafkaModule } from "src/global/kafka/kafka.module";
import { NotiModule } from "src/noti/noti.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: POST_COLLECTION_NAME, schema: PostSchema },
    ]),
    KafkaModule,
    NotiModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepostory],
  exports: [PostRepostory],
})
export class PostModule {}
