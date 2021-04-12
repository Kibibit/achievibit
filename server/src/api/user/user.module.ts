import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User } from '@kb-models';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.modelName, schema: User.schema }
    ])
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
