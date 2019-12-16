import { Module } from '@nestjs/common';

import { ReposModule } from '../repos/repos.module';
import { GithubEventManagerService } from './github-event-manager.service';

@Module({
  imports: [ ReposModule ],
  providers: [ GithubEventManagerService ],
  exports: [ GithubEventManagerService ]
})
export class GithubEventManagerModule { }
