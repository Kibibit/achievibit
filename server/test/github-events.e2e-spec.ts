import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import request from 'supertest';

import { PullRequestService } from '@kb-api';
import { AppModule } from '@kb-app';
import { ConfigService } from '@kb-config';
import {
  pullRequestAssigneeAddedEvent,
  pullRequestAssigneeRemovedEvent,
  pullRequestClosedEvent,
  pullRequestCreatedEvent,
  pullRequestEditedEvent,
  pullRequestLabelAddedEvent,
  pullRequestLabelRemovedEvent,
  pullRequestLabelsInitializedEvent,
  pullRequestReviewCommentAdded,
  pullRequestReviewCommentEdited,
  pullRequestReviewCommentRemoved,
  pullRequestReviewRequestRemovedEvent,
  pullRequestReviewSubmitted,
  pullReuqestReviewRequestAddedEvent,
  webhookPingEvent
} from '@kb-dev-tools';
import { PullRequest } from '@kb-models';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prService: PullRequestService;
  let server;
  let db: typeof mongoose;

  beforeAll(async () => {
    const config = new ConfigService();

    db = await mongoose.connect(config.dbUrl, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await db.connection.db.dropDatabase();
    await db.disconnect();
  });

  beforeEach(async () => {
    await db.connection.db.dropDatabase();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
    prService = moduleFixture.get(PullRequestService);
  });

  afterEach(async () => {
    await app.close();
  });

  test('/ (POST) github ping event should create db repo', async () => {
    const server = app.getHttpServer();
    const sendWebhookResponse = await request(server)
      .post('/api/webhook-event-manager')
      .send(webhookPingEvent.payload) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .set('x-github-event', webhookPingEvent.event)
      .expect(201);

    expect(sendWebhookResponse.text).toMatchSnapshot();

    const getAllReposResponse = await request(server)
      .get('/api/repo')
      .expect(200);

    expect(getAllReposResponse.body).toMatchSnapshot();
  });

  describe('pr events', () => {
    test('/ (POST) github pull request created event should create user',
      async () => {
        const server = app.getHttpServer();
        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestCreatedEvent.event)
          .send(pullRequestCreatedEvent.payload)
          .expect(201);

        expect(sendWebhookResponse.text).toMatchSnapshot();

        await confirmPrDataCreated();
      });

      test('/ (POST) github pull request labeled: init', async () => {
        const server = app.getHttpServer();
        await request(server)
            .post('/api/webhook-event-manager')
            .set('Accept', 'application/json')
            .set('x-github-event', pullRequestCreatedEvent.event)
            .send(pullRequestCreatedEvent.payload)
            .expect(201);
        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestLabelsInitializedEvent.event)
          .send(pullRequestLabelsInitializedEvent.payload)
          .expect(201);
  
        expect(sendWebhookResponse.text).toMatchSnapshot();
  
        await confirmPrDataCreated();
      });

      test('/ (POST) github pull request labeled', async () => {
        const server = app.getHttpServer();
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestCreatedEvent.event)
          .send(pullRequestCreatedEvent.payload)
          .expect(201);
        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestLabelAddedEvent.event)
          .send(pullRequestLabelAddedEvent.payload)
          .expect(201);
  
        expect(sendWebhookResponse.text).toMatchSnapshot();
  
        await confirmPrDataCreated();
      });

      test('/ (POST) github pull request label removed', async () => {
        const server = app.getHttpServer();
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestCreatedEvent.event)
          .send(pullRequestCreatedEvent.payload)
          .expect(201);
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestLabelsInitializedEvent.event)
          .send(pullRequestLabelsInitializedEvent.payload)
          .expect(201);
        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestLabelRemovedEvent.event)
          .send(pullRequestLabelRemovedEvent.payload)
          .expect(201);
  
        expect(sendWebhookResponse.text).toMatchSnapshot();
  
        await confirmPrDataCreated();
      });

      test('/ (POST) github pull request edited', async () => {
        const server = app.getHttpServer();
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestCreatedEvent.event)
          .send(pullRequestCreatedEvent.payload)
          .expect(201);
        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestEditedEvent.event)
          .send(pullRequestEditedEvent.payload)
          .expect(201);
    
        expect(sendWebhookResponse.text).toMatchSnapshot();
    
        await confirmPrDataCreated();
      }); 
      
      test('/ (POST) github pull request assignee added', async () => {
        const server = app.getHttpServer();
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestCreatedEvent.event)
          .send(pullRequestCreatedEvent.payload)
          .expect(201);
        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestAssigneeAddedEvent.event)
          .send(pullRequestAssigneeAddedEvent.payload)
          .expect(201);
    
        expect(sendWebhookResponse.text).toMatchSnapshot();
    
        await confirmPrDataCreated();
      }); 

      test('/ (POST) github pull request assignee removed', async () => {
        const server = app.getHttpServer();
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestCreatedEvent.event)
          .send(pullRequestCreatedEvent.payload)
          .expect(201);
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestAssigneeAddedEvent.event)
          .send(pullRequestAssigneeAddedEvent.payload)
          .expect(201);

        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestAssigneeRemovedEvent.event)
          .send(pullRequestAssigneeRemovedEvent.payload)
          .expect(201);
    
        expect(sendWebhookResponse.text).toMatchSnapshot();
    
        await confirmPrDataCreated();
      }); 

      test('/ (POST) github pull request review requested', async () => {
        const server = app.getHttpServer();
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestCreatedEvent.event)
          .send(pullRequestCreatedEvent.payload)
          .expect(201);
        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullReuqestReviewRequestAddedEvent.event)
          .send(pullReuqestReviewRequestAddedEvent.payload)
          .expect(201);
    
        expect(sendWebhookResponse.text).toMatchSnapshot();
    
        await confirmPrDataCreated();
      });
      
      test('/ (POST) github pull request reviewer removed', async () => {
        const server = app.getHttpServer();
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestCreatedEvent.event)
          .send(pullRequestCreatedEvent.payload)
          .expect(201);
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullReuqestReviewRequestAddedEvent.event)
          .send(pullReuqestReviewRequestAddedEvent.payload)
          .expect(201);
        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestReviewRequestRemovedEvent.event)
          .send(pullRequestReviewRequestRemovedEvent.payload)
          .expect(201);
    
        expect(sendWebhookResponse.text).toMatchSnapshot();
    
        await confirmPrDataCreated();
      });

      test('/ (POST) github pull request review comment add', async () => {
        const server = app.getHttpServer();
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestCreatedEvent.event)
          .send(pullRequestCreatedEvent.payload)
          .expect(201);
        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event',
            pullRequestReviewCommentAdded.reviewCommentAdded.event)
          .send(pullRequestReviewCommentAdded.reviewCommentAdded.payload)
          .expect(201);
    
        expect(sendWebhookResponse.text).toMatchSnapshot();
    
        await confirmPrDataCreated();
      });

      test('/ (POST) github pull request review comment del', async () => {
        const server = app.getHttpServer();
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestCreatedEvent.event)
          .send(pullRequestCreatedEvent.payload)
          .expect(201);
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event',
            pullRequestReviewCommentAdded.reviewCommentAdded.event)
          .send(pullRequestReviewCommentAdded.reviewCommentAdded.payload)
          .expect(201);
        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event',
            pullRequestReviewCommentRemoved.event)
          .send(pullRequestReviewCommentRemoved.payload)
          .expect(201);
    
        expect(sendWebhookResponse.text).toMatchSnapshot();
    
        await confirmPrDataCreated();
      });

      test('/ (POST) github pull request review comment edit', async () => {
        const server = app.getHttpServer();
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestCreatedEvent.event)
          .send(pullRequestCreatedEvent.payload)
          .expect(201);
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event',
            pullRequestReviewCommentAdded.reviewCommentAdded.event)
          .send(pullRequestReviewCommentAdded.reviewCommentAdded.payload)
          .expect(201);
        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event',
            pullRequestReviewCommentEdited.event)
          .send(pullRequestReviewCommentEdited.payload)
          .expect(201);
    
        expect(sendWebhookResponse.text).toMatchSnapshot();
    
        await confirmPrDataCreated();
      });

      test('/ (POST) github pull request review submitted', async () => {
        const server = app.getHttpServer();
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestCreatedEvent.event)
          .send(pullRequestCreatedEvent.payload)
          .expect(201);
        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event',
            pullRequestReviewSubmitted.event)
          .send(pullRequestReviewSubmitted.payload)
          .expect(201);
    
        expect(sendWebhookResponse.text).toMatchSnapshot();
    
        await confirmPrDataCreated();
      });
      
      test('/ (POST) github pull request closed', async () => {
        const server = app.getHttpServer();
        await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event', pullRequestCreatedEvent.event)
          .send(pullRequestCreatedEvent.payload)
          .expect(201);
        const sendWebhookResponse = await request(server)
          .post('/api/webhook-event-manager')
          .set('Accept', 'application/json')
          .set('x-github-event',
            pullRequestClosedEvent.event)
          .send(pullRequestClosedEvent.payload)
          .expect(201);
    
        expect(sendWebhookResponse.text).toMatchSnapshot();
    
        await confirmPrDataCreated();
      });

    async function confirmPrDataCreated() {
      const server = app.getHttpServer();
      const getAllUsersResponse = await request(server)
              .get('/api/user')
              .expect(200);
    
      expect(getAllUsersResponse.body).toMatchSnapshot();
    
      const getAllReposResponse = await request(server)
        .get('/api/repo')
        .expect(200);
    
      expect(getAllReposResponse.body).toMatchSnapshot();
    
      const prsDB = await prService.findAllAsync();
      const prs = prsDB.map((prDB) => new PullRequest(prDB.toObject()));
    
      expect(prs).toMatchSnapshot();
    }
  });
});
