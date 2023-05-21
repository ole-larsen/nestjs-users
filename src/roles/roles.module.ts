import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from "./entities/role.entity";
import { RolesSubscriber } from "./subscribers/roles.subscriber";

import {UsersService} from "../users/users.service";
import {User} from "../users/entities/user.entity";
import {HttpModule} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    HttpModule
  ],
  controllers: [RolesController],
  providers: [
    ConfigService,
    UsersService,
    RolesService,
    RolesSubscriber
  ]
})
export class RolesModule {}
