import MockDate from 'mockdate';
import mongoose from 'mongoose';
import request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PullRequestService } from '@kb-api';
import { AppModule } from '@kb-app';
import { ConfigService } from '@kb-config';
import { pullRequestClosedEvent, pullRequestCreatedEvent } from '@kb-dev-tools';
import { TasksService } from '@kb-tasks';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prService: PullRequestService;
  let taskService: TasksService;
  let server;
  let db: typeof mongoose;
  const d15DaysFromNow = new Date();
  d15DaysFromNow.setDate(d15DaysFromNow.getDate() + 15);
  const d101DaysFromNow = new Date();
  d101DaysFromNow.setDate(d101DaysFromNow.getDate() + 101);

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
    taskService = moduleFixture.get(TasksService);
  });

  afterEach(async () => {
    await app.close();
    MockDate.reset();
  });

  test.todo('Delete 14 days ago MERGED PRs');

  test('Delete 14 days ago CLOSED PRs', async () => {    
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
        pullRequestClosedEvent.event)
      .send(pullRequestClosedEvent.payload)
      .expect(201);

    let prs = await prService.findAllAsync();
    expect(prs.length).toBe(1);

    // should not delete PR
    await taskService.removeStalePullRequests();
    prs = await prService.findAllAsync();
    expect(prs.length).toBe(1);

    MockDate.set(d15DaysFromNow);
    // SHOULD delete PR
    await taskService.removeStalePullRequests();
    prs = await prService.findAllAsync();
    expect(prs.length).toBe(0);
  });

  test('Delete 100 days ago OPEN PRs', async () => {    
    const server = app.getHttpServer();
    await request(server)
      .post('/api/webhook-event-manager')
      .set('Accept', 'application/json')
      .set('x-github-event', pullRequestCreatedEvent.event)
      .send(pullRequestCreatedEvent.payload)
      .expect(201);

    let prs = await prService.findAllAsync();
    expect(prs.length).toBe(1);

    // should not delete PR because it's new
    await taskService.removeStalePullRequests();
    prs = await prService.findAllAsync();
    expect(prs.length).toBe(1);

    // should not delete PR younger than 100 days
    MockDate.set(d15DaysFromNow);
    // SHOULD delete PR
    await taskService.removeStalePullRequests();
    prs = await prService.findAllAsync();
    expect(prs.length).toBe(1);

    // should not delete PR younger than 100 days
    MockDate.set(d101DaysFromNow);
    // SHOULD delete PR
    await taskService.removeStalePullRequests();
    prs = await prService.findAllAsync();
    expect(prs.length).toBe(0);
  });
});
