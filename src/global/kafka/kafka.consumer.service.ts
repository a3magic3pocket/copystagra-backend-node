import { Injectable } from "@nestjs/common";
import { KafkaConfigService } from "./kafka.config";
import { IKConsumerMessage } from "./interface/k-consumer-message.interface";

@Injectable()
export class KafkaConsumerService {
  private consumer;

  constructor(
    private kafkaConfigService: KafkaConfigService,
    private consumerGroupId: string
  ) {
    this.consumer = this.kafkaConfigService
      .getClient()
      .consumer({ groupId: this.consumerGroupId });
    this.consumer.connect();
  }

  async subscribe(topic: string, callback: (message: IKConsumerMessage) => Promise<boolean>) {
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const isOk = await callback({
          key: message.key ? message.key.toString() : "",
          value: message.value.toString(),
          headers: message.headers,
          partition: partition,
          offset: message.offset,
        });

        if (isOk) {
          this.commitManually({ topic, partition, offset: message.offset });
        }
      },
      autoCommit: false,
    });
  }

  private async commitManually({ topic, partition, offset }) {
    await this.consumer.commitOffsets([{ topic, partition, offset }]);
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
