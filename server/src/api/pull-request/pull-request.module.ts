import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PullRequest } from '@kb-models';

import { PullRequestController } from './pull-request.controller';
import { PullRequestService } from './pull-request.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PullRequest.modelName, schema: PullRequest.schema }
    ])
  ],
  providers: [PullRequestService],
  controllers: [PullRequestController],
  exports: [PullRequestService]
})
export class PullRequestModule {}
