import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from '@kb-config';
import { GithubEventManagerModule, ReposModule, ShieldsModule, UsersModule } from '@kb-modules';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestDatabaseModule } from './db-test.module';

const logger: Logger = new Logger('AppModule');

const config = new ConfigService();

logger.log(config.dbUrl ? 'found db url. connecting to mongodb' : 'did not find a db url. using in-memory instance');
@Module({
  imports: [
    config.dbUrl ? MongooseModule.forRoot(config.dbUrl) : TestDatabaseModule,
    UsersModule,
    ReposModule,
    ShieldsModule,
    GithubEventManagerModule,
    ConfigModule
  ],
  controllers: [ AppController ],
  providers: [ AppService ]
})
export class AppModule { }
