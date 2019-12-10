import { UsersModule } from '@kb-modules/users/users.module';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReposModule } from './modules/repos/repos.module';

@Module({
  imports: [ UsersModule, ReposModule ],
  controllers: [ AppController ],
  providers: [ AppService ]
})
export class AppModule { }
