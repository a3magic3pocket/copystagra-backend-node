import { Module } from "@nestjs/common";
import { NotiController } from "./noti.controller";
import { NotiService } from "./noti.service";
import { NotiRepository } from "./noti.repository";
import { NotiCheckModule } from "src/noticheck/noti-check.module";
import { MongooseModule } from "@nestjs/mongoose";
import { NOTI_COLLECTION_NAME, NotiSchema } from "./schema/noti.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NOTI_COLLECTION_NAME, schema: NotiSchema },
    ]),
    NotiCheckModule,
  ],
  controllers: [NotiController],
  providers: [NotiService, NotiRepository],
})
export class NotiModule {}
