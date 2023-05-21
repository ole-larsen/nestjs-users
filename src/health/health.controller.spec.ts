import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {TerminusModule} from "@nestjs/terminus";
import {TerminusLogger} from "./services/terminus-logger.service";
import {HttpModule} from "@nestjs/axios";
import {ServiceUnavailableException} from "@nestjs/common";

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TerminusModule.forRoot({
          logger: TerminusLogger,
        }),
        HttpModule
      ],
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('controller method check should be defined', () => {
    expect(controller.check).toBeDefined();
  });

  it('explain controller method check', async () => {
    try {
      await controller.check();
    } catch (e) {
      expect(e instanceof ServiceUnavailableException).toBe(true);
    }
  });
});
