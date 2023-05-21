import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./entities/user.entity";
import { UsersSubscriber } from "./subscribers/usersSubscriber";
import { Role } from "../roles/entities/role.entity";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    HttpModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersSubscriber,
  ],
})
export class UsersModule {}
