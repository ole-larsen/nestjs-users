import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

import mockRoleRepositoryProvider, {mockRoles} from "./test/mock.repository";
import {HttpException} from "@nestjs/common";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";
import {CreateEntityDto} from "./dto/create-entity.dto";
import {UpdateEntityDto} from "./dto/update-entity.dto";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";
import mockUserRepositoryProvider from "../users/test/mock.repository";
import {HttpModule} from "@nestjs/axios";

describe('RolesController', () => {

  let controller: RolesController;

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

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('method should be defined', () => {
    expect(controller.findAll).toBeDefined();
  });

  it('method should be defined', () => {
    expect(controller.findOne).toBeDefined();
  });

  it('method should be defined', () => {
    expect(controller.create).toBeDefined();
  });

  it('method should be defined', () => {
    expect(controller.update).toBeDefined();
  });

  it('method should be defined', () => {
    expect(controller.remove).toBeDefined();
  });

  it('describe findAll method', async () => {
    const units = await controller.findAll();
    expect(units.list.length).toBe(mockRoles.length);
  });

  it('describe findOne method', async () => {
    try {
      const unit = await controller.findOne(100);
      expect(unit).toBe(null);
    } catch(e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE);
    }
  });

  it('describe findOne method', async () => {
    const unit = await controller.findOne(1);
    expect(unit.id).toBe(1);
  });

  it('describe create method with empty parameters', async () => {
    const entity = new CreateEntityDto();
    try {
      await controller.create(entity);
    } catch(e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE);
    }
  });

  it('describe create exists method with empty parameters', async () => {
    const createEntityDto = new CreateEntityDto();
    createEntityDto.title = 'role 1';
    try {
      await controller.create(createEntityDto);
    } catch(e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE);
    }
  });

  it('describe create method with correct parameters', async () => {
    const role = new CreateEntityDto();
    role.title = 'role 12';
    try {
      await controller.create(role);
      expect(mockRoles[mockRoles.length - 1].title = role.title);
    } catch(e) {
      expect(e).toBe(undefined);
    }
  });

  it('describe non exists update method', async () => {
    const updateEntityDto = new UpdateEntityDto();
    try {
      await controller.update(112, updateEntityDto);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE);
    }
  });

  it('describe exists update method with invalid parameters', async () => {
    const updateEntityDto = new UpdateEntityDto();
    try {
      await controller.update(3, updateEntityDto);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE);
    }
  });

  it('describe exists update method with valid parameters', async () => {
    const updateEntityDto = new UpdateEntityDto();
    updateEntityDto.title = 'updated role';
    updateEntityDto.description = 'updated role description';

    try {
      await controller.update(3, updateEntityDto);

      expect(mockRoles[3].title).toBe(updateEntityDto.title);
    } catch (e) {
      expect(e).toBe(undefined);
    }
    try {
      await controller.update(4, updateEntityDto);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE);
    }
  });

  it('describe remove method with valid parameters', async () => {
    const id = 3;
    try {
      await controller.remove(id);

      expect(mockRoles[3].enabled).toBe(false);
      expect(!!mockRoles[3].deleted).toBe(true);

    } catch (e) {
      expect(e).toBe(undefined);
    }
    // cannot delete twice
  });

});
