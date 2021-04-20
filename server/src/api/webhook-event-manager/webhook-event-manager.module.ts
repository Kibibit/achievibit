import { Module } from '@nestjs/common';

import { PullRequestModule } from '../pull-request/pull-request.module';
import { RepoModule } from '../repo/repo.module';
import { UserModule } from '../user/user.module';
import {
  WebhookEventManagerController
} from './webhook-event-manager.controller';
import { WebhookEventManagerService } from './webhook-event-manager.service';

@Module({
  imports: [ UserModule, RepoModule, PullRequestModule ],
  controllers: [WebhookEventManagerController],
  providers: [
    WebhookEventManagerService
  ]
})
export class WebhookEventManagerModule {}
