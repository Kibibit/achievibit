import { Module } from '@nestjs/common';

import { PullRequestsModule } from '../pull-requests/pull-requests.module';
import { ReposModule } from '../repos/repos.module';
import { UsersModule } from '../users/users.module';
import { GithubEventManagerService } from './github-event-manager.service';

@Module({
  imports: [ UsersModule, ReposModule, PullRequestsModule ],
  providers: [ GithubEventManagerService ],
  exports: [ GithubEventManagerService ]
})
export class GithubEventManagerModule { }
