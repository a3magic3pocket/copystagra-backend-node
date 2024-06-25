import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

export const initTestMongodb = async () => {
  if (!mongo) {
    mongo = await MongoMemoryServer.create();
  }
};

export const getTestMongodbUri = () => {
  return mongo.getUri();
};

export const disconnectTestMongodb = async () => {
  if (mongo) {
    await mongo.stop();
  }
};
