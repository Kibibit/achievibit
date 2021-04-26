import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from '@kb-config';

import {
  createInMemoryDatabaseModule
} from '../dev-tools/in-memory-database.module';
import { ApiController } from './api.controller';
import { PullRequestModule } from './pull-request/pull-request.module';
import { RepoModule } from './repo/repo.module';
import { UserModule } from './user/user.module';
import {
  WebhookEventManagerModule
} from './webhook-event-manager/webhook-event-manager.module';

const config = new ConfigService();
@Module({
  controllers: [ApiController],
  imports: [
    config.dbUrl ?
      MongooseModule.forRoot(config.dbUrl, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
      }) :
      createInMemoryDatabaseModule(),
    UserModule,
    RepoModule,
    WebhookEventManagerModule,
    PullRequestModule,
    ConfigModule
  ]
})
export class ApiModule {
  logger: Logger = new Logger('ApiModule');

  constructor() {
    this.logger.log(config.dbUrl ?
      `Connecting to database: ${ config.dbUrl }` :
      'No DB address given. Using in-memory DB'
    );
  }

  
}
