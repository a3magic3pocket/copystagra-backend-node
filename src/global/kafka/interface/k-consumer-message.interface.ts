export interface IKConsumerMessage {
  key: string;
  value: Buffer;
  headers: Record<string, string>;
  partition: number;
  offset: number;
}
