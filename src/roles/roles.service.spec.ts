import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { RolesController } from "./roles.controller";
import { HttpException } from "@nestjs/common";
import { CreateEntityDto } from "./dto/create-entity.dto";
import { UpdateEntityDto } from "./dto/update-entity.dto";
import { HttpExceptionMessages } from "./dto/exceptions/http-exception-messages.constants";
import mockRoleRepositoryProvider, { mockRoles } from "./test/mock.repository";
import mockUserRepositoryProvider from "../users/test/mock.repository";

import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

import mockMailerOptionsProvider from "../auth/test/mock.mailer.options";
import {MailerService} from "@nestjs-modules/mailer";
import {HttpModule} from "@nestjs/axios";




describe('RolesService', () => {

  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ HttpModule ],
      controllers: [RolesController],
      providers: [
        ConfigService,
        JwtService,
        RolesService,
        UsersService,
        mockRoleRepositoryProvider(),
        mockUserRepositoryProvider(),
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('service method should be defined', () => {
    expect(service.findAll).toBeDefined();
  });

  it('service method should be defined', () => {
    expect(service.findOne).toBeDefined();
  });

  it('service method should be defined', () => {
    expect(service.create).toBeDefined();
  });

  it('service method should be defined', () => {
    expect(service.update).toBeDefined();
  });

  it('service method should be defined', () => {
    expect(service.remove).toBeDefined();
  });

  it('service should have findAll method', async () => {
    const roles = await service.findAll();
    expect(roles.list.length).toBe(mockRoles.length);
  });

  it('service should have findOne method', async () => {
    const role = await service.findOne(1);
    expect(role.id).toBe(1);
  });

  it('service should have create method', async () => {
    const newRole = new CreateEntityDto();
    newRole.title = 'new role';
    newRole.description = 'new role description';
    newRole.enabled = true;
    expect((await service.create(newRole)).id).toBe(mockRoles.length);
    expect(mockRoles[mockRoles.length - 1].title).toBe(newRole.title);
  });

  it('service should have create method and throw an error if role already exists', async () => {
    const newRole = new CreateEntityDto();
    newRole.title = 'new role';
    newRole.description = 'new role description';
    newRole.enabled = true;

    try {
      await service.create(newRole);
    } catch (e) {
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE);
    }
  });

  it('service should have update method', async () => {
    const id = 1;
    let exists = await service.findOne(id);
    expect(exists.id).toBe(id);
    const role = new UpdateEntityDto();
    role.title = 'updated role';
    role.description = 'updated role description';
    role.enabled = true;

    await service.update(id, role);

    exists = await service.findOne(id);

    expect(exists.title).toBe(role.title);
    expect(exists.description).toBe(role.description);
  });

  it('service should have remove method', async () => {
    const id = 12;

    try {
      await service.remove(id);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_ALREADY_DELETED_EXCEPTION_MESSAGE);
    }
  });

  it('service should have remove method', async () => {
    const id = 1;

    try {
      await service.remove(id);
      expect(!!mockRoles[id].deleted).toBe(true);
    } catch (e) {
      expect(e).toBe(undefined);
    }
  });
});
