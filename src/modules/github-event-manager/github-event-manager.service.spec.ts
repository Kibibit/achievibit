import { Test, TestingModule } from '@nestjs/testing';

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
  webhookPingEvent,
} from '@kb-dev-tools';
import { AchievibitEventNames, GithubEventManagerService, UsersService } from '@kb-modules';

import { ReposService } from '../repos/repos.service';

const userDto = DtoMockGenerator.userDto();
const repoDto = DtoMockGenerator.repoDto();

describe('GithubEventManagerService', () => {
  let service: GithubEventManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubEventManagerService,
        { provide: UsersService, useValue: { create: (...anything) => userDto } },
        { provide: ReposService, useValue: { create: (...anything) => repoDto } }
      ]
    }).compile();

    service = module.get<GithubEventManagerService>(GithubEventManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('it should translate GitHubEvents to AchievibitEvents', () => {
    describe('Pull Request Events', () => {
      it('Ping Event', () => {
        const result = service.translateToEventName(
          webhookPingEvent.event,
          webhookPingEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.NewConnection);
      });

      it('Open Event', () => {
        const result = service.translateToEventName(
          pullRequestCreatedEvent.event,
          pullRequestCreatedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestOpened);
      });

      it('Edit Event (title or description edit)', () => {
        const result = service.translateToEventName(
          pullRequestEditedEvent.event,
          pullRequestEditedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestEdited);
      });

      it('Initial Labels (added when pull request is created)', () => {
        const result = service.translateToEventName(
          pullRequestLabelsInitializedEvent.event,
          pullRequestLabelsInitializedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestInitialLabeled);
      });

      it('Add Label Event', () => {
        const result = service.translateToEventName(
          pullRequestLabelAddedEvent.event,
          pullRequestLabelAddedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestLableAdded);
      });

      it('Removed Label Event', () => {
        const result = service.translateToEventName(
          pullRequestLabelRemovedEvent.event,
          pullRequestLabelRemovedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestLabelRemoved);
      });

      it('Add Assignee Event', () => {
        const result = service.translateToEventName(
          pullRequestAssigneeAddedEvent.event,
          pullRequestAssigneeAddedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestAssigneeAdded);
      });

      it('Remove Assignee Event', () => {
        const result = service.translateToEventName(
          pullRequestAssigneeRemovedEvent.event,
          pullRequestAssigneeRemovedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestAssigneeRemoved);
      });

      it('Merge Pull Request Event', () => {
        const result = service.translateToEventName(
          pullRequestMergedEvent.event,
          pullRequestMergedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestMerged);
      });
    });

    describe('Pull Request Review Events', () => {
      it('Review Request Added Event', () => {
        const result = service.translateToEventName(
          pullReuqestReviewRequestAddedEvent.event,
          pullReuqestReviewRequestAddedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestReviewRequestAdded);
      });

      it('Review Request Removed Event', () => {
        const result = service.translateToEventName(
          pullRequestReviewRequestRemovedEvent.event,
          pullRequestReviewRequestRemovedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestReviewRequestRemoved);
      });

      it('Review Comment Added Event', () => {
        const result = service.translateToEventName(
          reviewCommentAddedEvent.event,
          reviewCommentAddedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestReviewCommentAdded);
      });

      it('Review Comment Removed Event', () => {
        const result = service.translateToEventName(
          reviewCommentRemovedEvent.event,
          reviewCommentRemovedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestReviewCommentRemoved);
      });

      it('Review Comment Edited Event', () => {
        const result = service.translateToEventName(
          reviewCommentEditedEvent.event,
          reviewCommentEditedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestReviewCommentEdited);
      });

      it('Review Submitted Event', () => {
        const result = service.translateToEventName(
          reviewSubmittedEvent.event,
          reviewSubmittedEvent.payload
        );

        expect(result).toBe(AchievibitEventNames.PullRequestReviewSubmitted);
      });

      it.todo('Review Edited Event');
    });

  });
});
