import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Address } from "./entities/address.entity";
import { HttpModule } from "@nestjs/axios";
import {AddressesSubscriber} from "./subscribers/addresses.subscriber";
import {Role} from "../roles/entities/role.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Address]),
    HttpModule,
  ],
  controllers: [AddressesController],
  providers: [
    AddressesService,
    AddressesSubscriber
  ]
})
export class AddressesModule {}
