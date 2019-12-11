import { Module } from '@nestjs/common';
import { GithubEventManagerService } from './github-event-manager.service';

@Module({
  providers: [GithubEventManagerService]
})
export class GithubEventManagerModule {}
