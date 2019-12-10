import { USER_MODEL_NAME, UserSchema } from '@kb-models/user.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [ MongooseModule.forFeature([ { name: USER_MODEL_NAME, schema: UserSchema } ]) ],
  providers: [ UsersService ],
  controllers: [ UsersController ]
})
export class UsersModule { }
