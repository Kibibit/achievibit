import { Module } from '@nestjs/common';

import { ReposModule } from '../repos/repos.module';
import { UsersModule } from '../users/users.module';
import { GithubEventManagerService } from './github-event-manager.service';

@Module({
  imports: [ ReposModule, UsersModule ],
  providers: [ GithubEventManagerService ],
  exports: [ GithubEventManagerService ]
})
export class GithubEventManagerModule { }
