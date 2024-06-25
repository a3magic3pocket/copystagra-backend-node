import { Inject, Injectable } from "@nestjs/common";
import { NotiRepository } from "./noti.repository";
import { NotiCheckRepository } from "@src/noticheck/noti-check.repository";
import { NotiRetrDto } from "./dto/noti-retr.dto";
import { NotiMapRepository } from "./noti-map.repository";
import { CONSUMER_GROUP_ID, KAFKA_TOPIC } from "@src/global/kafka/kafka-info";
import { KafkaConsumerService } from "@src/global/kafka/kafka.consumer.service";
import { IKNotiCreationDto } from "./interface/k-noti-creation-dto.interface";
import { getKorTime } from "@src/global/time/time-util";
import { IKNotiCreationConsumerDependency } from "./interface/k-noti-creation-consumer-dependency-dto-interface";
import { IKConsumerMessage } from "@src/global/kafka/interface/k-consumer-message.interface";
import { KafkaProducerService } from "@src/global/kafka/kafka.producer.service";
import { Noti } from "./schema/noti.schema";
import { getSha256Buffer } from "@src/global/crypto/hash";
import { Types } from "mongoose";

@Injectable()
export class NotiService {
  constructor(
    private notiRepository: NotiRepository,
    private notiMapRepository: NotiMapRepository,
    private notiCheckRepository: NotiCheckRepository,
    private kafkaProducerService: KafkaProducerService,
    @Inject(CONSUMER_GROUP_ID.NOTI_CREATION)
    private kafkaConsumerService: KafkaConsumerService
  ) {
    const kafkaConsumerDependencies: IKNotiCreationConsumerDependency = {
      notiRepository: this.notiRepository,
    };
    this.kafkaConsumerService.subscribe(
      KAFKA_TOPIC.NOTI_CREATION,
      this.consumeNotiCreation,
      kafkaConsumerDependencies
    );
  }

  async createNoti(to: string, code: string, relatedPostId: string) {
    const notiMap = await this.notiMapRepository.findByNotiCode(code);
    if (notiMap === null) {
      return false;
    }

    const kNotiCreationDto: IKNotiCreationDto = {
      ownerId: to,
      content: notiMap.content,
      relatedPostId: relatedPostId,
      createdAt: getKorTime(new Date()).toISOString(),
    };

    const key = crypto.randomUUID();
    this.kafkaProducerService.sendMessage(
      KAFKA_TOPIC.NOTI_CREATION,
      key,
      JSON.stringify(kNotiCreationDto)
    );
  }

  async consumeNotiCreation(
    message: IKConsumerMessage,
    dependencies: IKNotiCreationConsumerDependency
  ) {
    try {
      const kNotiCreationDto: IKNotiCreationDto = JSON.parse(
        message.value.toString()
      );

      const source = Object.values(kNotiCreationDto).join("|");
      const docHash = await getSha256Buffer(source);

      const newNoti = new Noti(
        new Types.ObjectId(kNotiCreationDto.ownerId),
        kNotiCreationDto.content,
        new Types.ObjectId(kNotiCreationDto.relatedPostId),
        Buffer.from(docHash),
        kNotiCreationDto.createdAt
      );

      const notiRepository = dependencies.notiRepository;
      await notiRepository.createNoti(newNoti);
    } catch (e) {
      console.error(e);
    } finally {
      return true;
    }
  }

  async getLatestNotis(
    pageNum: number,
    pageSize: number,
    ownerId: string
  ): Promise<NotiRetrDto[]> {
    const skip = (pageNum - 1) * pageSize;
    return await this.notiRepository.getLatestNotis(skip, pageSize, ownerId);
  }

  async getMyUncheckedNotis(
    pageNum: number,
    pageSize: number,
    ownerId: string
  ) {
    const skip = (pageNum - 1) * pageSize;
    const initialTime = new Date("1899-01-01T00:00:00");
    const notiCheck = await this.notiCheckRepository.findByOwnerId(ownerId);
    const notiCheckedDate =
      notiCheck === null ? initialTime.toISOString() : notiCheck.checkedTime;

    return await this.notiRepository.getMyUncheckedNotis(
      skip,
      pageSize,
      ownerId,
      notiCheckedDate
    );
  }
}
