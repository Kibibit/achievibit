import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KibibitLoggerService } from './services/kibibit-logger.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, KibibitLoggerService]
})
export class AppModule {}
