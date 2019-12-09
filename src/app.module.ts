import { UsersModule } from '@kb-modules/users/users.module';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ UsersModule ],
  controllers: [ AppController ],
  providers: [ AppService ]
})
export class AppModule { }
