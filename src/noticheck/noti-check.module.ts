import { Module } from "@nestjs/common";
import { NotiCheckController } from "./noti-check.controller";
import { NotiCheckRepository } from "./noti-check.repository";
import { MongooseModule } from "@nestjs/mongoose";
import {
  NOTI_CHECK_COLLECTION_NAME,
  NotiCheckSchema,
} from "./schema/noti-check.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NOTI_CHECK_COLLECTION_NAME, schema: NotiCheckSchema },
    ]),
  ],
  controllers: [NotiCheckController],
  providers: [NotiCheckRepository],
  exports: [NotiCheckRepository],
})
export class NotiCheckModule {}
