import { Logger, Module, Type } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigService } from '@kb-config';
import { PullRequest } from '@kb-models';

import { PullRequestController } from './pull-request.controller';
import { PullRequestService } from './pull-request.service';

const devControllers: Type<any>[] = [PullRequestController];
const logger = new Logger('PullRequestModule');

const config = new ConfigService();
const controllers = (() => {
  if (config.nodeEnv === 'production') {
    return [];
  } else {
    logger.log('Not running in production mode!');
    logger.warn('Attaching Pull Request controller for development');
    return devControllers;
  }
})();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PullRequest.modelName, schema: PullRequest.schema }
    ])
  ],
  providers: [PullRequestService],
  controllers,
  exports: [PullRequestService]
})
export class PullRequestModule {}
