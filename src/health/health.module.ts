import { Module } from '@nestjs/common';
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from './health.controller';
import {HttpModule} from "@nestjs/axios";
import {TerminusLogger} from "./services/terminus-logger.service";

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: TerminusLogger,
    }),
    HttpModule
  ],
  controllers: [HealthController]
})
export class HealthModule {}
