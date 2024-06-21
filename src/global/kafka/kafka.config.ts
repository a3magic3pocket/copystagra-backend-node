import { Injectable } from "@nestjs/common";
import { Kafka, logLevel } from "kafkajs";

@Injectable()
export class KafkaConfigService {
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.CLIENT_ID,
      brokers: [process.env.KAFKA_CLIENT_BOOTSTRAP_SERVER],
      logLevel: logLevel.INFO,
    });
  }

  getClient(): Kafka {
    return this.kafka;
  }
}
