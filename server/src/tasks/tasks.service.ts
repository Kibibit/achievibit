import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PullRequestService } from '@kb-api';
import { ConfigService } from '@kb-config';
import { TaskHealthCheck } from '@kb-decorators';
import { PRStatus, PullRequest } from '@kb-models';

const configService = new ConfigService;
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prService: PullRequestService) {
    this.logger.log('tasks started');
  }
  
  /** At 00:00 on Sunday */
  /** https://crontab.guru/every-week */
  @Cron(CronExpression.EVERY_WEEK)
  @TaskHealthCheck(configService.deletePRsHealthId)
  async removeStalePullRequests() {
    const d100daysAgo = new Date();
    d100daysAgo.setDate(d100daysAgo.getDate() - 100);
    const d14daysAgo = new Date();
    d14daysAgo.setDate(d14daysAgo.getDate() - 14);

    this.logger.debug(`Removing Stale OPEN PRs older than: ${ d100daysAgo }`);
    const openPRsForDeletion = await this.getPRsBy(
      d100daysAgo,
      PRStatus.OPEN
    );
    await this.deletePRsByIds(openPRsForDeletion);

    this.logger.debug(`Removing CLOSED PRs older than: ${ d14daysAgo }`);
    const closedPRsForDeletion = await this.getPRsBy(
      d14daysAgo,
      PRStatus.CLOSED
    );
    await this.deletePRsByIds(closedPRsForDeletion);

    this.logger.debug(`Removing MERGED PRs older than: ${ d14daysAgo }`);
    const mergedPRsForDeletion = await this.getPRsBy(
      d14daysAgo,
      PRStatus.MERGED
    );
    await this.deletePRsByIds(mergedPRsForDeletion);
  }

  private async getPRsBy(deleteBefore: Date, status: PRStatus) {
    const prs = await this.prService.findAllAsync({
      updatedAt: {
        $lte : deleteBefore
      },
      status: status
    });

    return prs.map((pr) => new PullRequest(pr.toObject()).prid);
  }

  private async deletePRsByIds(ids: string[]) {
    if (ids.length) {
      this.logger.log('Removing PRs:');
      this.logger.log(ids);
      await this.prService.deleteAsync({
        prid: { $in: ids }
      });
    }
  }
}
