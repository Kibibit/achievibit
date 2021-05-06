import {
  Body,
  Controller,
  Headers,
  Logger,
  Post,
  UseFilters
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { KbValidationExceptionFilter } from '@kb-filters';
import { IGithubPullRequestEvent } from '@kb-interfaces';

import { WebhookEventManagerService } from './webhook-event-manager.service';

@Controller('api/webhook-event-manager')
@ApiTags('Webhook Event Manager')
@UseFilters(new KbValidationExceptionFilter())
export class WebhookEventManagerController {
  private readonly logger = new Logger(WebhookEventManagerController.name);

  constructor(
    private readonly webhookEventManagerService: WebhookEventManagerService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Recieve GitHub Webhooks' })
  async recieveGitHubWebhooks(
    @Headers('x-github-event') githubEvent: string,
    @Body() eventBody: IGithubPullRequestEvent
  ): Promise<string> {
    const eventName = await this.webhookEventManagerService
      .notifyAchievements(githubEvent, eventBody);

    return eventName;
  }
}
