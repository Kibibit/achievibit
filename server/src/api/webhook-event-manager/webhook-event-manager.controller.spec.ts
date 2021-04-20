import { Test, TestingModule } from '@nestjs/testing';

import {
  WebhookEventManagerController
} from './webhook-event-manager.controller';
import { WebhookEventManagerService } from './webhook-event-manager.service';

describe('WebhookEventManagerController', () => {
  let controller: WebhookEventManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: WebhookEventManagerService,
        useValue: {}
      }],
      controllers: [WebhookEventManagerController]
    }).compile();

    controller = module
      .get<WebhookEventManagerController>(WebhookEventManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
