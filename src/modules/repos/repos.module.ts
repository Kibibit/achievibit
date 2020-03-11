import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { REPO_MODEL_NAME, RepoSchema } from '@kb-models';

import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';


@Module({
  imports: [ MongooseModule.forFeature([ { name: REPO_MODEL_NAME, schema: RepoSchema } ]) ],
  providers: [ ReposService ],
  controllers: [ ReposController ],
  exports: [ ReposService ]
})
export class ReposModule { }
