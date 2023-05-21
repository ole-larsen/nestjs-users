import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from "@nestjs/typeorm";

import { Profile } from "./entities/profile.entity";
import { User } from "../users/entities/user.entity";
import {ProfilesSubscriber} from "./subscribers/profiles.subscriber";
import {HttpModule, HttpService} from "@nestjs/axios";
import {Role} from "../roles/entities/role.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Profile]),
    HttpModule
  ],
  controllers: [ProfilesController],
  providers: [
    ProfilesService,
    ProfilesSubscriber
  ]
})
export class ProfilesModule {}
