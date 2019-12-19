import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import nunjucks from 'nunjucks';
import request from 'supertest';

import { AppModule } from '@kb-app';
import { ConfigService } from '@kb-config';
import {
  InMemoryDatabaseModule,
  pullRequestCreatedEvent,
  pullRequestCreatedOrganizationEvent,
  webhookPingEvent
} from '@kb-dev-tools';
import { PullRequestsService } from '@kb-modules';

// new ConfigService({});

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;
  let pullRequestsService: PullRequestsService;

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
    pullRequestsService = moduleFixture.get(PullRequestsService);
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

  afterEach(async (done) => {
    new ConfigService({}).closeEvents();
    await InMemoryDatabaseModule.closeDatabase();

    done();
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

    const allPullRequests = await pullRequestsService.findAll();

    expect(allPullRequests).toMatchSnapshot();
  });

  test('/ (POST) from github pull request created event should create user and organization', async () => {
    const server = app.getHttpServer();
    const sendWebhookResponse = await request(server)
      .post('/')
      .set('Accept', 'application/json')
      .set('x-github-event', pullRequestCreatedOrganizationEvent.event)
      .send(pullRequestCreatedOrganizationEvent.payload)
      .expect(201);

    expect(sendWebhookResponse.text).toMatchSnapshot();

    const getAllUsersResponse = await request(server)
      .get('/api/users')
      .expect(200);

    expect(getAllUsersResponse.body.length).toBe(2);
    expect(getAllUsersResponse.body).toMatchSnapshot();
  });
});
