import { UsersModule } from '@kb-modules/users/users.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReposModule } from './modules/repos/repos.module';
import { ShieldsModule } from './modules/shields/shields.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/achievibit'),
    UsersModule,
    ReposModule,
    ShieldsModule
  ],
  controllers: [ AppController ],
  providers: [ AppService ]
})
export class AppModule { }
