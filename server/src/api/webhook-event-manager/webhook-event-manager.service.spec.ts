/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { IGithubPullRequestEvent } from '@kb-interfaces';

import { PullRequestService } from '../pull-request/pull-request.service';
import { RepoService } from '../repo/repo.service';
import { UserService } from '../user/user.service';
import { WebhookEventManagerService } from './webhook-event-manager.service';

const PullRequestEventsCases = [
  [AchievibitEventNames.NewConnection, webhookPingEvent, 'handleNewConnection'],
  [
    AchievibitEventNames.PullRequestOpened,
    pullRequestCreatedEvent,
    'handlePullRequestOpened'
  ],
  [
    AchievibitEventNames.PullRequestEdited,
    pullRequestEditedEvent,
    'handlePullRequestEdited'
  ],
  [
    AchievibitEventNames.PullRequestInitialLabeled,
    pullRequestLabelsInitializedEvent,
    'handlePullRequestInitialLabeled'
  ],
  [
    AchievibitEventNames.PullRequestLableAdded,
    pullRequestLabelAddedEvent,
    'handlePullRequestLabelAdded'
  ],
  [
    AchievibitEventNames.PullRequestLabelRemoved,
    pullRequestLabelRemovedEvent,
    'handlePullRequestLabelRemoved'
  ],
  [
    AchievibitEventNames.PullRequestAssigneeAdded,
    pullRequestAssigneeAddedEvent,
    'handlePullRequestAssigneeAdded'
  ],
  [
    AchievibitEventNames.PullRequestAssigneeRemoved,
    pullRequestAssigneeRemovedEvent,
    'handlePullRequestAssigneeRemoved'
  ],
  [
    AchievibitEventNames.PullRequestMerged,
    pullRequestMergedEvent,
    'handlePullRequestMerged'
  ]
];

const PullRequestReviewEventsCases = [
  [
    AchievibitEventNames.PullRequestReviewRequestAdded,
    pullReuqestReviewRequestAddedEvent,
    'handlePullRequestReviewRequestAdded'
  ],
  [
    AchievibitEventNames.PullRequestReviewRequestRemoved,
    pullRequestReviewRequestRemovedEvent,
    'handlePullRequestReviewRequestRemoved'
  ],
  [
    AchievibitEventNames.PullRequestReviewCommentAdded,
    reviewCommentAddedEvent,
    'handlePullRequestReviewCommentAdded'
  ],
  [
    AchievibitEventNames.PullRequestReviewCommentRemoved,
    reviewCommentRemovedEvent,
    'handlePullRequestReviewCommentRemoved'
  ],
  [
    AchievibitEventNames.PullRequestReviewCommentEdited,
    reviewCommentEditedEvent,
    'handlePullRequestReviewCommentEdited'
  ],
  [
    AchievibitEventNames.PullRequestReviewSubmitted,
    reviewSubmittedEvent,
    'handlePullRequestReviewSubmitted'
  ]
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
          useValue: { create: () => user }
        },
        {
          provide: RepoService,
          useValue: { create: () => repo }
        },
        {
          provide: PullRequestService,
          useValue: { create: () => pullRequest }
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
      it('should ignore unrecognized events', () => {
        const result = service
          .translateToEventName('nice', {} as IGithubPullRequestEvent);

        expect(result).toBeUndefined();
      });

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

    it.each(PullRequestEventsCases)(
      'should catch %p event',
      async (internalEventName, webhookData: any, engineFuncName: any) => {
        jest.spyOn(GithubEngine.prototype, engineFuncName)
          .mockImplementation(() => Promise.resolve());
        await service
          .notifyAchievements(webhookData.event, webhookData.payload);

        expect(service.githubEngine[engineFuncName]).
          toHaveBeenCalledWith(webhookData.payload);
        expect(service.githubEngine[engineFuncName])
          .toHaveBeenCalledTimes(1);
    });

    it.each(PullRequestReviewEventsCases)(
      'should catch %p - review event',
      async (internalEventName, webhookData: any, engineFuncName: any) => {
        jest.spyOn(GithubEngine.prototype, engineFuncName)
          .mockImplementation(() => Promise.resolve());
        await service
          .notifyAchievements(webhookData.event, webhookData.payload);

        expect(service.githubEngine[engineFuncName]).
          toHaveBeenCalledWith(webhookData.payload);
        expect(service.githubEngine[engineFuncName])
          .toHaveBeenCalledTimes(1);
    });
  });
});
