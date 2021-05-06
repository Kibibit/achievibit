import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import {
  closeInMemoryDatabaseConnection,
  createInMemoryDatabaseModule,
  DtoMockGenerator
} from '@kb-dev-tools';
import { PullRequest } from '@kb-models';

import { IFetchedData, PullRequestService } from './pull-request.service';

describe('PullRequestService', () => {
  let service: PullRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        createInMemoryDatabaseModule(),
        MongooseModule.forFeature([{
          name: PullRequest.modelName,
          schema: PullRequest.schema
        }])
      ],
      providers: [PullRequestService]
    }).compile();

    service = module.get<PullRequestService>(PullRequestService);
  }, 10000);

  afterEach(async () => {
    await closeInMemoryDatabaseConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add and remove labels', async () => {
    const mockPr = DtoMockGenerator.pullRequest();
    await service.create(mockPr);
    await service.addLabels(mockPr.prid, 'pizza', true);
    await service.addLabels(mockPr.prid, 'lazagna');
    let dbPR = await service.findOneAsync({ prid: mockPr.prid });
    let pr = new PullRequest(dbPR.toObject());
    expect(pr.labels).toContain('pizza');
    expect(pr.labels).toContain('lazagna');

    await service.removeLabels(mockPr.prid, 'pizza');
    dbPR = await service.findOneAsync({ prid: mockPr.prid });
    pr = new PullRequest(dbPR.toObject());
    expect(pr.labels).not.toContain('pizza');
    expect(pr.labels).toContain('lazagna');

    await service.removeLabels(mockPr.prid, 'lazagna');
    dbPR = await service.findOneAsync({ prid: mockPr.prid });
    pr = new PullRequest(dbPR.toObject());
    expect(pr.labels).not.toContain('pizza');
    expect(pr.labels).not.toContain('lazagna');
  });

  it('should edit PR title and body', async () => {
    const mockPr = DtoMockGenerator.pullRequest();
    const newTitle = DtoMockGenerator.string();
    const newDescription = DtoMockGenerator.paragraph();
    await service.create(mockPr);
    await service.editPRData(mockPr.prid, {
      title: newTitle
    }, {
      title: { from: mockPr.title }
    });
    let dbPR = await service.findOneAsync({ prid: mockPr.prid });
    let pr = new PullRequest(dbPR.toObject());
    expect(pr.title).toBe(newTitle);
    expect(pr.history.title).toBeDefined();

    await service.editPRData(mockPr.prid, {
      description: newDescription
    }, {
      body: { from: mockPr.description }
    });
    dbPR = await service.findOneAsync({ prid: mockPr.prid });
    pr = new PullRequest(dbPR.toObject());
    expect(pr.description).toBe(newDescription);
    expect(pr.history.description).toBeDefined();
  });

  it('should edit PR assignees', async () => {
    const mockPr = DtoMockGenerator.pullRequest();
    const mockAssignees = DtoMockGenerator.users();
    const mockUsernames = mockAssignees.map((user) => user.username);
    await service.create(mockPr);
    await service.updateAssignees(mockPr.prid, mockAssignees);
    const dbPR = await service.findOneAsync({ prid: mockPr.prid });
    const pr = new PullRequest(dbPR.toObject());
    expect(pr.assignees).toEqual(expect.arrayContaining(mockUsernames));
  });

  it('should edit PR reviewers', async () => {
    const mockPr = DtoMockGenerator.pullRequest();
    const mockReviewer = DtoMockGenerator.user();
    await service.create(mockPr);
    await service.updateReviewers(mockPr.prid, mockReviewer);
    let dbPR = await service.findOneAsync({ prid: mockPr.prid });
    let pr = new PullRequest(dbPR.toObject());
    expect(pr.reviewers).toContain(mockReviewer.username);
    await service.updateReviewers(mockPr.prid, mockReviewer, true);
    dbPR = await service.findOneAsync({ prid: mockPr.prid });
    pr = new PullRequest(dbPR.toObject());
    expect(pr.reviewers).not.toContain(mockReviewer.username);
  });

  it('should add extra PR data', async () => {
    const mockPr = DtoMockGenerator.pullRequest();
    await service.create(mockPr);
    const extraData: IFetchedData = {
      comments: [{ id: 'comment' }],
      commits: [{ id: 'commit' }],
      files: [{ name: 'file.ts' }],
      reactions: [{ id: 'reaction' }],
      reviewComments: [{ id: 'review-comment' }],
      reviews: [{ id: 'review' }]
    };
    await service.updatePRExtraData(mockPr.prid, extraData);
    const dbPR = await service.findOneAsync({ prid: mockPr.prid });
    const pr = new PullRequest(dbPR.toObject());
    expect(pr).toEqual(expect.objectContaining(extraData));
  });
});
