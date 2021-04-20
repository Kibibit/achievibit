import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Repo } from '@kb-models';

import { RepoController } from './repo.controller';
import { RepoService } from './repo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Repo.modelName, schema: Repo.schema }
    ])
  ],
  providers: [RepoService],
  controllers: [RepoController],
  exports: [RepoService]
})
export class RepoModule {}
