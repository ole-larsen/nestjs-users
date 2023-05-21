import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import {databaseProviders} from "./providers/database.provider";

@Module({
  controllers: [SystemController],
  providers: [...databaseProviders],
})
export class SystemModule {}
