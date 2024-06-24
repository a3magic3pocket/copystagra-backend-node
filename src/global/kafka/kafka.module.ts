import { Module } from "@nestjs/common";
import { KafkaConfigService } from "./kafka.config";
import { KafkaProducerService } from "./kafka.producer.service";
import { KafkaConsumerFactory } from "./kafka-consumer.factory";
import { CONSUMER_GROUP_ID } from "./kafka-info";

@Module({
  providers: [
    KafkaConfigService,
    KafkaProducerService,
    KafkaConsumerFactory,
    {
      provide: CONSUMER_GROUP_ID.POST_CREATION,
      useFactory: (factory: KafkaConsumerFactory) =>
        factory.createKafkaConsumerService(CONSUMER_GROUP_ID.POST_CREATION),
      inject: [KafkaConsumerFactory],
    },
  ],
  exports: [KafkaProducerService, `${CONSUMER_GROUP_ID.POST_CREATION}`], // Export services for injection
})
export class KafkaModule {}
