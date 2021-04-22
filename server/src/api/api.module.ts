import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from '@kb-config';

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
    MongooseModule.forRoot('mongodb://localhost:27017'),
    UserModule,
    RepoModule,
    WebhookEventManagerModule,
    PullRequestModule,
    ConfigModule
  ]
})
export class ApiModule {}
