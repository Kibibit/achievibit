import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

export const createInMemoryDatabaseModule =
  (options: MongooseModuleOptions = {}) => MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = new MongoMemoryServer();
      const mongoUri = await mongod.getUri();
      return {
        uri: mongoUri,
        ...options
      }
    }
  });

export const closeInMemoryDatabaseConnection = async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
}
