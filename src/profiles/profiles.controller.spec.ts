import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

import mockUserRepositoryProvider from "../users/test/mock.repository";
import mockProfileRepositoryProvider, {mockProfiles} from "./test/mock.repository";

import {HttpException} from "@nestjs/common";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";
import {CreateEntityDto} from "./dto/create-entity.dto";
import {UpdateEntityDto} from "./dto/update-entity.dto";
import {UpdateEntityResponseDto} from "./dto/update-entity-response.dto";
import mockRoleRepositoryProvider from "../roles/test/mock.repository";
import {HttpModule} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";

describe('ProfilesController', () => {
  let controller: ProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule
      ],
      controllers: [ProfilesController],
      providers: [
        ConfigService,
        ProfilesService,
        mockUserRepositoryProvider(),
        mockRoleRepositoryProvider(),
        mockProfileRepositoryProvider()
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('method findAll should be defined', () => {
    expect(controller.findAll).toBeDefined();
  });

  it('describe findAll method', async () => {
    const units = await controller.findAll();
    expect(units.list.length).toBe(mockProfiles.length);
  });

  it('method findOne should be defined', () => {
    expect(controller.findOne).toBeDefined();
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

  it('method create should be defined', () => {
    expect(controller.create).toBeDefined();
  });

  it('describe create method with empty parameters', async () => {
    const createEntityDto = new CreateEntityDto();
    try {
      await controller.create(createEntityDto);
    } catch(e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE);
    }
  });

  it('describe create method with valid parameters', async () => {
    const createEntityDto = new CreateEntityDto();
    createEntityDto.username = 'someRandomUserXXX';
    createEntityDto.userId = 1;
    createEntityDto.firstName = 'Ole';
    createEntityDto.lastName = 'Larsen';
    createEntityDto.birthdate = '11-05-1988';
    createEntityDto.about = 'there is some information about me';
    createEntityDto.enabled = true;

    try {
      await controller.create(createEntityDto);
      expect(mockProfiles[mockProfiles.length - 1].username).toBe(createEntityDto.username);
    } catch(e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE);
    }
  });

  it('method update should be defined', () => {
    expect(controller.update).toBeDefined();
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

  it('describe update method with valid id and username parameters', async () => {
    const id = 10;
    const updateEntityDto = new UpdateEntityDto();
    updateEntityDto.userId = 10;
    updateEntityDto.username = 'someRandomUser-10';
    updateEntityDto.firstName = 'First-10';
    updateEntityDto.lastName = 'Larsen-10';
    updateEntityDto.birthdate = '09/05/1988';
    updateEntityDto.about = 'there is updated some information about me';
    try {
      const response = await controller.update(id, updateEntityDto);
      expect(response instanceof UpdateEntityResponseDto).toBe(true);
      expect(response.id).toBe(id);
    } catch (e) {
      expect(e).toBe(undefined);
    }
  });

  it('method remove should be defined', () => {
    expect(controller.remove).toBeDefined();
  });

  it('describe remove method with valid parameters', async () => {
    const id = 3;
    try {
      await controller.remove(id);

      expect(mockProfiles[3].enabled).toBe(false);
      expect(!!mockProfiles[3].deleted).toBe(true);

    } catch (e) {
      expect(e).toBe(undefined);
    }
    // cannot delete twice
  });
});
