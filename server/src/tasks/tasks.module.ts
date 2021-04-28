import { Module } from '@nestjs/common';

import { PullRequestModule } from '@kb-api';

import { TasksService } from './tasks.service';

@Module({
  imports: [PullRequestModule],
  providers: [TasksService]
})
export class TasksModule {}
