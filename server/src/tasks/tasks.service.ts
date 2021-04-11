import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  
  /** Run every minute */
  @Cron('* * * * *')
  handleCron() {
    this.logger.debug('Scheduled task example: Called once every minute');
  }
}
