import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {response} from "express";

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(404);
  });

  it('/api/v1/users/ (GET)', () => {
    return request(app.getHttpServer())
      .get('http://localhost:3011/api/v1/users')
      .then(_response => {
        console.log(_response);
      })
      .catch(e => {
        console.log(e);
      });
  });


});
