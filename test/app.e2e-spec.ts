import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import nunjucks from 'nunjucks';
import request from 'supertest';

import { AppModule } from '@kb-app';
import { InMemoryDatabaseModule, pullRequestCreatedEvent, webhookPingEvent } from '@kb-dev-tools';

// new ConfigService({});

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ AppModule ]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setViewEngine('njk');
    app.set('view engine', 'njk');
    nunjucks.configure('views', {
      autoescape: true,
      express: app,
      watch: true
    });

    await app.init();
  });

  test('/ (GET) should return homepage at root of App', async () => {
    console.log('server is running');
    const response = await request(app.getHttpServer())
      .get('/')
      .expect(200);

    expect(response.text).toMatchSnapshot();
  });

  test('/api (GET) should return API hello page with package info', async () => {
    console.log('server is running');
    const response = await request(app.getHttpServer())
      .get('/api')
      .expect(200);

    expect(response.text).toMatchSnapshot();
  });

  afterEach(async () => {
    await InMemoryDatabaseModule.closeDatabase();
  });

  test('/ (POST) from github ping event should create db repo', async () => {
    const server = app.getHttpServer();
    const sendWebhookResponse = await request(server)
      .post('/')
      .send(webhookPingEvent.payload) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .set('x-github-event', webhookPingEvent.event)
      .expect(201);

    expect(sendWebhookResponse.text).toMatchSnapshot();

    const getAllReposResponse = await request(server)
      .get('/api/repos')
      .expect(200);

    expect(getAllReposResponse.body).toMatchSnapshot();
  });

  test('/ (POST) from github pull request created event should create user', async () => {
    const server = app.getHttpServer();
    const sendWebhookResponse = await request(server)
      .post('/')
      .set('Accept', 'application/json')
      .set('x-github-event', pullRequestCreatedEvent.event)
      .send(pullRequestCreatedEvent.payload)
      .expect(201);

    expect(sendWebhookResponse.text).toMatchSnapshot();

    const getAllUsersResponse = await request(server)
      .get('/api/users')
      .expect(200);

    expect(getAllUsersResponse.body).toMatchSnapshot();
  });
});
