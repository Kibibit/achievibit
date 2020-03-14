import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, USER_MODEL_NAME } from '@kb-models';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [ MongooseModule.forFeature([ { name: USER_MODEL_NAME, schema: User.schema() } ]) ],
  providers: [ UsersService ],
  controllers: [ UsersController ],
  exports: [ UsersService ]
})
export class UsersModule { }
