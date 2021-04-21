import { Test, TestingModule } from '@nestjs/testing';

import { AchievibitEventNames } from '@kb-abstracts';
import {
  DtoMockGenerator,
  pullRequestAssigneeAddedEvent,
  pullRequestAssigneeRemovedEvent,
  pullRequestCreatedEvent,
  pullRequestEditedEvent,
  pullRequestLabelAddedEvent,
  pullRequestLabelRemovedEvent,
  pullRequestLabelsInitializedEvent,
  pullRequestMergedEvent,
  pullRequestReviewRequestRemovedEvent,
  pullReuqestReviewRequestAddedEvent,
  reviewCommentAddedEvent,
  reviewCommentEditedEvent,
  reviewCommentRemovedEvent,
  reviewSubmittedEvent,
  webhookPingEvent
} from '@kb-dev-tools';
import { GithubEngine } from '@kb-engines';

import { PullRequestService } from '../pull-request/pull-request.service';
import { RepoService } from '../repo/repo.service';
import { UserService } from '../user/user.service';
import { WebhookEventManagerService } from './webhook-event-manager.service';

const PullRequestEventsCases = [
  [AchievibitEventNames.NewConnection, webhookPingEvent],
  [AchievibitEventNames.PullRequestOpened, pullRequestCreatedEvent],
  [AchievibitEventNames.PullRequestEdited, pullRequestEditedEvent],
  [
    AchievibitEventNames.PullRequestInitialLabeled,
    pullRequestLabelsInitializedEvent
  ],
  [AchievibitEventNames.PullRequestLableAdded, pullRequestLabelAddedEvent],
  [AchievibitEventNames.PullRequestLabelRemoved, pullRequestLabelRemovedEvent],
  [
    AchievibitEventNames.PullRequestAssigneeAdded,
    pullRequestAssigneeAddedEvent
  ],
  [
    AchievibitEventNames.PullRequestAssigneeRemoved,
    pullRequestAssigneeRemovedEvent
  ],
  [AchievibitEventNames.PullRequestMerged, pullRequestMergedEvent]
];

const PullRequestReviewEventsCases = [
  [
    AchievibitEventNames.PullRequestReviewRequestAdded,
    pullReuqestReviewRequestAddedEvent
  ],
  [
    AchievibitEventNames.PullRequestReviewRequestRemoved,
    pullRequestReviewRequestRemovedEvent
  ],
  [AchievibitEventNames.PullRequestReviewCommentAdded, reviewCommentAddedEvent],
  [
    AchievibitEventNames.PullRequestReviewCommentRemoved,
    reviewCommentRemovedEvent
  ],
  [
    AchievibitEventNames.PullRequestReviewCommentEdited,
    reviewCommentEditedEvent
  ],
  [AchievibitEventNames.PullRequestReviewSubmitted, reviewSubmittedEvent]
];

describe('WebhookEventManagerService', () => {
  let service: WebhookEventManagerService;
  const user = DtoMockGenerator.user();
  const repo = DtoMockGenerator.repo();
  const pullRequest = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookEventManagerService,
        {
          provide: UserService,
          useValue: { create: (...anything) => user }
        },
        {
          provide: RepoService,
          useValue: { create: (...anything) => repo }
        },
        {
          provide: PullRequestService,
          useValue: { create: (...anything) => pullRequest }
        }
      ]
    }).compile();

    service = module
      .get<WebhookEventManagerService>(WebhookEventManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Translate GitHubEvents to AchievibitEvents', () => {
    describe('Translate to internal events', () => {
      it.each(PullRequestEventsCases)(
        'should handle %p event',
        (internalEventName, webhookData: any) => {
          const result = service.translateToEventName(
            webhookData.event,
            webhookData.payload
          );

          expect(result).toBe(internalEventName);
      });
    });

    describe('Pull Request Review Events', () => {
      it.each(PullRequestReviewEventsCases)(
        'should handle %p event',
        (internalEventName, webhookData: any) => {
          const result = service.translateToEventName(
            webhookData.event,
            webhookData.payload
          );

          expect(result).toBe(internalEventName);
      });

      it.todo('Review Edited Event');
    });
  });

  describe('notifyAchievements', () => {
    it('should catch new connections', async () => {
      jest.spyOn(GithubEngine.prototype, 'handleNewConnection')
        .mockImplementation(() => Promise.resolve());
      await service
        .notifyAchievements(webhookPingEvent.event, webhookPingEvent.payload);

      expect(service.githubEngine.handleNewConnection).toHaveBeenCalledWith(
        webhookPingEvent.payload
      );
      expect(service.githubEngine.handleNewConnection)
        .toHaveBeenCalledTimes(1);
    });

    it('should catch open pull request', async () => {
      jest.spyOn(GithubEngine.prototype, 'handlePullRequestOpened')
        .mockImplementation(() => Promise.resolve());
      await service
        .notifyAchievements(
          pullRequestCreatedEvent.event,
          pullRequestCreatedEvent.payload
        );

      expect(service.githubEngine.handlePullRequestOpened).toHaveBeenCalledWith(
        pullRequestCreatedEvent.payload
      );
      expect(service.githubEngine.handlePullRequestOpened)
        .toHaveBeenCalledTimes(1);
    });

    
  });
});
