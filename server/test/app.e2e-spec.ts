import { valid } from 'semver';
import request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@kb-app';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterEach(async() => {
    await app.close();
  });

  test('/api (GET) API Information', async () => {
    const response = await request(server).get('/api');
    expect(response.status).toBe(200);
    expect(response.body.version).toBeDefined();
    expect(valid(response.body.version)).toBeTruthy();
    response.body.version = 'SEMVER';
    expect(response.body).toMatchSnapshot();
  });

  test('/ (GET) HTML of client application', async () => {
    const response = await request(server).get('/');
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/html/);
  });
});
