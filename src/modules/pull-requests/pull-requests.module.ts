import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PULL_REQUEST_MODEL_NAME, PullRequestSchema } from '@kb-models';

import { PullRequestsController } from './pull-requests.controller';
import { PullRequestsService } from './pull-requests.service';

@Module({
  imports: [ MongooseModule.forFeature([ { name: PULL_REQUEST_MODEL_NAME, schema: PullRequestSchema } ]) ],
  providers: [ PullRequestsService ],
  exports: [ PullRequestsService ],
  controllers: [ PullRequestsController ]
})
export class PullRequestsModule { }
