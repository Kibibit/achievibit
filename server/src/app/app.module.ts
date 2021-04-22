import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ApiModule } from '@kb-api';
import { ConfigModule } from '@kb-config';
import { EventsGateway, EventsModule } from '@kb-events';
import { TasksService } from '@kb-tasks';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ApiModule,
    ScheduleModule.forRoot(),
    EventsModule,
    ConfigModule
  ],
  controllers: [AppController],
  providers: [AppService, TasksService, EventsGateway]
})
export class AppModule {}
