import { UsersModule } from '@kb-modules/users/users.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { TestDatabaseModule } from './db-test.module';
import { GithubEventManagerModule } from './modules/github-event-manager/github-event-manager.module';
import { ReposModule } from './modules/repos/repos.module';
import { ShieldsModule } from './modules/shields/shields.module';

const config = new ConfigService();

console.log(config.dbUrl ? 'found db url. connecting to mongodb' : 'did not find a db url. using in-memory instance');
@Module({
  imports: [
    config.dbUrl ? MongooseModule.forRoot(config.dbUrl) : TestDatabaseModule,
    UsersModule,
    ReposModule,
    ShieldsModule,
    ConfigModule
  ],
  controllers: [ AppController ],
  providers: [ AppService ]
})
export class AppModule { }
