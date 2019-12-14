import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;
let uri: string;

async function testDBFactory() {
  mongod = new MongoMemoryServer();
  uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
  return { uri };
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: testDBFactory
    })
  ]
})
export class TestDatabaseModule {
  static async closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
    mongod = null;
    uri = null;
  }
}
