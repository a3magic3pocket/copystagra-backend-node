import { Module } from "@nestjs/common";
import { KafkaConfigService } from "./kafka.config";
import { KafkaProducerService } from "./kafka.producer.service";
import { KafkaConsumerService } from "./kafka.consumer.service";

@Module({
  providers: [KafkaConfigService, KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService, KafkaConsumerService], // Export services for injection
})
export class KafkaModule {}
