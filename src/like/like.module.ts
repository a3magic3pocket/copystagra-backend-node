import { Module } from "@nestjs/common";
import { LikeController } from "./like.controller";
import { PostModule } from "src/post/post.module";
import { LikeService } from "./like.service";
import { MongooseModule } from "@nestjs/mongoose";
import { LIKE_COLLECTION_NAME, LikeSchema } from "./schema/like.schema";
import { LikeRepostory } from "./like.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LIKE_COLLECTION_NAME, schema: LikeSchema },
    ]),
    PostModule,
  ],
  controllers: [LikeController],
  providers: [LikeService, LikeRepostory],
})
export class LikeModule {}
