import { Injectable } from "@nestjs/common";
import { KafkaConsumerService } from "./kafka.consumer.service";
import { KafkaConfigService } from "./kafka.config";
import { CONSUMER_GROUP_ID } from "./kafka-info";

@Injectable()
export class KafkaConsumerFactory {
  constructor(private kafkaConfigService: KafkaConfigService) {}
  createKafkaConsumerService(consumerGroupId: string): KafkaConsumerService {
    switch (consumerGroupId) {
      case CONSUMER_GROUP_ID.POST_CREATION:
        return new KafkaConsumerService(
          this.kafkaConfigService,
          consumerGroupId
        );
      default:
        throw new Error(`${consumerGroupId} is unsupported consumerGroupId`);
    }
  }
}
