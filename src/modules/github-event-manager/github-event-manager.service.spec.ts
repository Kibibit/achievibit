import { Test, TestingModule } from '@nestjs/testing';

import {
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

import { AchievibitEventName, GithubEventManagerService } from './github-event-manager.service';

describe('GithubEventManagerService', () => {
  let service: GithubEventManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ GithubEventManagerService ]
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

        expect(result).toBe(AchievibitEventName.NewConnection);
      });

      it('Open Event', () => {
        const result = service.translateToEventName(
          pullRequestCreatedEvent.event,
          pullRequestCreatedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestOpened);
      });

      it('Edit Event (title or description edit)', () => {
        const result = service.translateToEventName(
          pullRequestEditedEvent.event,
          pullRequestEditedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestEdited);
      });

      it('Initial Labels (added when pull request is created)', () => {
        const result = service.translateToEventName(
          pullRequestLabelsInitializedEvent.event,
          pullRequestLabelsInitializedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestInitialLabeled);
      });

      it('Add Label Event', () => {
        const result = service.translateToEventName(
          pullRequestLabelAddedEvent.event,
          pullRequestLabelAddedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestLableAdded);
      });

      it('Removed Label Event', () => {
        const result = service.translateToEventName(
          pullRequestLabelRemovedEvent.event,
          pullRequestLabelRemovedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestLabelRemoved);
      });

      it('Add Assignee Event', () => {
        const result = service.translateToEventName(
          pullRequestAssigneeAddedEvent.event,
          pullRequestAssigneeAddedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestAssigneeAdded);
      });

      it('Remove Assignee Event', () => {
        const result = service.translateToEventName(
          pullRequestAssigneeRemovedEvent.event,
          pullRequestAssigneeRemovedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestAssigneeRemoved);
      });

      it('Merge Pull Request Event', () => {
        const result = service.translateToEventName(
          pullRequestMergedEvent.event,
          pullRequestMergedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestMerged);
      });
    });

    describe('Pull Request Review Events', () => {
      it('Review Request Added Event', () => {
        const result = service.translateToEventName(
          pullReuqestReviewRequestAddedEvent.event,
          pullReuqestReviewRequestAddedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestReviewRequestAdded);
      });

      it('Review Request Removed Event', () => {
        const result = service.translateToEventName(
          pullRequestReviewRequestRemovedEvent.event,
          pullRequestReviewRequestRemovedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestReviewRequestRemoved);
      });

      it('Review Comment Added Event', () => {
        const result = service.translateToEventName(
          reviewCommentAddedEvent.event,
          reviewCommentAddedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestReviewCommentAdded);
      });

      it('Review Comment Removed Event', () => {
        const result = service.translateToEventName(
          reviewCommentRemovedEvent.event,
          reviewCommentRemovedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestReviewCommentRemoved);
      });

      it('Review Comment Edited Event', () => {
        const result = service.translateToEventName(
          reviewCommentEditedEvent.event,
          reviewCommentEditedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestReviewCommentEdited);
      });

      it('Review Submitted Event', () => {
        const result = service.translateToEventName(
          reviewSubmittedEvent.event,
          reviewSubmittedEvent.payload
        );

        expect(result).toBe(AchievibitEventName.PullRequestReviewSubmitted);
      });

      it.todo('Review Edited Event');
    });

  });
});
