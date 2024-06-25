import { Module } from "@nestjs/common";
import { NotiController } from "./noti.controller";
import { NotiService } from "./noti.service";
import { NotiRepository } from "./noti.repository";
import { NotiCheckModule } from "@src/noticheck/noti-check.module";
import { MongooseModule } from "@nestjs/mongoose";
import { NOTI_COLLECTION_NAME, NotiSchema } from "./schema/noti.schema";
import {
  NOTI_MAP_COLLECTION_NAME,
  NotiMapSchema,
} from "./schema/noti-map.schema";
import { KafkaModule } from "@src/global/kafka/kafka.module";
import { NotiMapRepository } from "./noti-map.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NOTI_COLLECTION_NAME, schema: NotiSchema },
      { name: NOTI_MAP_COLLECTION_NAME, schema: NotiMapSchema },
    ]),
    NotiCheckModule,
    KafkaModule,
  ],
  controllers: [NotiController],
  providers: [NotiService, NotiRepository, NotiMapRepository],
  exports: [NotiService],
})
export class NotiModule {}
