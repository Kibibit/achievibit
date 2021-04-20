import { Controller, Logger, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { KbValidationExceptionFilter } from '@kb-filters';

import { WebhookEventManagerService } from './webhook-event-manager.service';

@Controller('api/webhook-event-manager')
@ApiTags('Webhook Event Manager')
@UseFilters(new KbValidationExceptionFilter())
export class WebhookEventManagerController {
  private readonly logger = new Logger(WebhookEventManagerController.name);

  constructor(
    private readonly webhookEventManagerService: WebhookEventManagerService
  ) {}
}
