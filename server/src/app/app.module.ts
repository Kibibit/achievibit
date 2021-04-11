import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ApiModule } from '@kb-api';
import { EventsGateway, EventsModule } from '@kb-events';
import { TasksService } from '@kb-tasks';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ApiModule,
    ScheduleModule.forRoot(),
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService, TasksService, EventsGateway]
})
export class AppModule {}
