import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import request from 'supertest';

import { AppModule } from '@kb-app';
import { ConfigService } from '@kb-config';
import { pullRequestCreatedEvent, webhookPingEvent } from '@kb-dev-tools';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server;
  let db: typeof mongoose;

  beforeAll(async () => {
    const config = new ConfigService();

    db = await mongoose.connect(config.dbUrl);
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
  });

  afterEach(async () => {
    await app.close();
  });

  test('/ (POST) from github ping event should create db repo', async () => {
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

  test('/ (POST) from github pull request created event should create user',
  async () => {
    const server = app.getHttpServer();
    const sendWebhookResponse = await request(server)
      .post('/api/webhook-event-manager')
      .set('Accept', 'application/json')
      .set('x-github-event', pullRequestCreatedEvent.event)
      .send(pullRequestCreatedEvent.payload)
      .expect(201);

    expect(sendWebhookResponse.text).toMatchSnapshot();

    const getAllUsersResponse = await request(server)
      .get('/api/user')
      .expect(200);

    expect(getAllUsersResponse.body).toMatchSnapshot();

    const getAllReposResponse = await request(server)
      .get('/api/repo')
      .expect(200);

    expect(getAllReposResponse.body).toMatchSnapshot();
  });
});
