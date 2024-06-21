import { Injectable } from "@nestjs/common";
import { KafkaConfigService } from "./kafka.config";
import { CompressionTypes } from "kafkajs";

@Injectable()
export class KafkaProducerService {
  private producer;

  constructor(private kafkaConfigService: KafkaConfigService) {
    this.producer = this.kafkaConfigService.getClient().producer();
    this.producer.connect();
  }

  async sendMessage(
    topic: string,
    key: string,
    message: string,
    headers: Record<string, string> = {}
  ) {
    try {
      await this.producer.send({
        topic,
        messages: [{ key, value: message, headers }],
        compression: CompressionTypes.GZIP,
        acks: -1,
      });
      console.log(`Message sent to topic ${topic}: ${message}`);
    } catch (error) {
      console.error(`Error sending message to Kafka: ${error.message}`);
    }
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
