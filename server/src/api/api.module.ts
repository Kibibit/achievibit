import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ApiController } from './api.controller';
import { RepoModule } from './repo/repo.module';
import { UserModule } from './user/user.module';
import {
  WebhookEventManagerModule
} from './webhook-event-manager/webhook-event-manager.module';
import { PullRequestModule } from './pull-request/pull-request.module';

@Module({
  controllers: [ApiController],
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    UserModule,
    RepoModule,
    WebhookEventManagerModule,
    PullRequestModule
  ]
})
export class ApiModule {}
