import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PullRequestService } from '@kb-api';
import { PullRequest } from '@kb-models';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prService: PullRequestService) {
    this.logger.log('tasks started');
  }
  
  /** At 00:00 on Sunday */
  /** https://crontab.guru/every-week */
  @Cron(CronExpression.EVERY_WEEK)
  async removeStalePullRequests() {
    const deleteBefore = new Date();
    deleteBefore.setDate(deleteBefore.getDate() - 100);

    this.logger.debug(`Removing Stale PRs older than: ${ deleteBefore }`);
    const prs = await this.prService.findAllAsync({
      updatedAt: {
        $lte : deleteBefore
      }
    });

    const forDeletion = prs.map((pr) => new PullRequest(pr.toObject()).prid);

    if (forDeletion.length) {
      this.logger.log('Removing Stale PRs:');
      this.logger.log(forDeletion);
      await this.prService.deleteAsync({
        prid: { $in: forDeletion }
      });
    }
  }
}
