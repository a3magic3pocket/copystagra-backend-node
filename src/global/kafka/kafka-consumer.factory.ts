import { Injectable } from "@nestjs/common";
import { KafkaConsumerService } from "./kafka.consumer.service";
import { KafkaConfigService } from "./kafka.config";
import { CONSUMER_GROUP_ID } from "./kafka-info";

@Injectable()
export class KafkaConsumerFactory {
  constructor(private kafkaConfigService: KafkaConfigService) {}
  createKafkaConsumerService(consumerGroupId: string): KafkaConsumerService {
    if (!Object.values(CONSUMER_GROUP_ID).includes(consumerGroupId)) {
      throw new Error(`${consumerGroupId} is unsupported consumerGroupId`);
    }

    return new KafkaConsumerService(this.kafkaConfigService, consumerGroupId);
  }
}
