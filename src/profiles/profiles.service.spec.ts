import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import mockUserRepositoryProvider from "../users/test/mock.repository";
import mockProfileRepositoryProvider, {mockProfiles} from "./test/mock.repository";
import {HttpException} from "@nestjs/common";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";
import {CreateEntityDto} from "./dto/create-entity.dto";

import {UpdateEntityDto} from "./dto/update-entity.dto";
import {UpdateEntityResponseDto} from "./dto/update-entity-response.dto";
import {DeleteEntityResponseDto} from "./dto/delete-entity-response.dto";
import mockRoleRepositoryProvider from "../roles/test/mock.repository";
import {HttpModule} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";

describe('ProfilesService', () => {
  let service: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        ConfigService,
        ProfilesService,
        mockUserRepositoryProvider(),
        mockRoleRepositoryProvider(),
        mockProfileRepositoryProvider()
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('method findAll should be defined', () => {
    expect(service.findAll).toBeDefined();
  });

  it('describe findAll method should be defined', async () => {
    const entities = await service.findAll();
    expect(entities.list.length).toEqual(mockProfiles.length);
  });


  it('method findOne should be defined', () => {
    expect(service.findOne).toBeDefined();
  });

  it('describe findOne method with invalid id', async () => {
    try {
      const entity = await service.findOne(100);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE);
    }
  });

  it('describe findOne method with valid id', async () => {
    try {
      const entity = await service.findOne(1);
      expect(entity.id).toBe(1);
    } catch (e) {
      console.log(e);
    }
  });

  it('method create should be defined', () => {
    expect(service.create).toBeDefined();
  });

  it('describe create method without username parameter', async () => {
    const createEntityDto = new CreateEntityDto();
    try {
      await service.create(createEntityDto);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE);
    }
  });

  it('describe create method without userId parameter', async () => {
    const createEntityDto = new CreateEntityDto();
    createEntityDto.username = 'someRandomUser';
    try {
      await service.create(createEntityDto);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE);
    }
  });

  it('describe create method with invalid userId parameter', async () => {
    const createEntityDto = new CreateEntityDto();
    createEntityDto.username = 'someRandomUser';
    createEntityDto.userId = 100;
    try {
      await service.create(createEntityDto);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE);
    }
  });

  it('describe create method with valid parameters', async () => {
    const createEntityDto = new CreateEntityDto();
    createEntityDto.username = 'someRandomUser';
    createEntityDto.userId = 1;
    createEntityDto.firstName = 'Ole';
    createEntityDto.lastName = 'Larsen';
    createEntityDto.birthdate = '11-05-1988';
    createEntityDto.about = 'there is some information about me';
    createEntityDto.enabled = true;
    try {
      await service.create(createEntityDto);
      expect(mockProfiles[mockProfiles.length - 1].username).toBe(createEntityDto.username);
    } catch (e) {
      expect(e).toBe(undefined);
    }
  });

  it('describe create method with valid parameters second time', async () => {
    const createEntityDto = new CreateEntityDto();
    createEntityDto.username = 'someRandomUser';
    createEntityDto.userId = 1;
    createEntityDto.firstName = 'Ole';
    createEntityDto.lastName = 'Larsen';
    createEntityDto.birthdate = '11/05/1988';
    createEntityDto.about = 'there is some information about me';
    createEntityDto.enabled = true;
    try {
      await service.create(createEntityDto);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE);
    }
  });

  it('method update should be defined', () => {
    expect(service.update).toBeDefined();
  });

  it('describe update method with invalid id parameter', async () => {
    const id = 100;
    const updateEntityDto = new UpdateEntityDto();
    try {
      await service.update(id, updateEntityDto);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE);
    }
  });

  it('describe update method with valid id parameter', async () => {
    const id = 10;
    const updateEntityDto = new UpdateEntityDto();
    try {
      await service.update(id, updateEntityDto);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE);
    }
  });

  it('describe update method with valid id and existed username parameters', async () => {
    const id = 10;
    const updateEntityDto = new UpdateEntityDto();
    updateEntityDto.username = 'someRandomUser';
    try {
      await service.update(id, updateEntityDto);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE);
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
      const response = await service.update(id, updateEntityDto);
      expect(response instanceof UpdateEntityResponseDto).toBe(true);
      expect(response.id).toBe(id);
    } catch (e) {
      expect(e).toBe(undefined);
    }
  });

  it('method remove should be defined', () => {
    expect(service.remove).toBeDefined();
  });

  it('describe remove method without parameters', async () => {
    const id = undefined;
    try {
      await service.remove(id);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE)
    }
  });

  it('describe remove method with invalid parameters', async () => {
    const id = 100;
    try {
      await service.remove(id);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE)
    }
  });

  it('describe remove method with valid parameters', async () => {
    const id = 12;
    try {
      const response = await service.remove(id);
      expect(response instanceof DeleteEntityResponseDto).toBe(true);
      expect(response.id).toBe(id);
    } catch (e) {
      expect(e).toBe(undefined);
    }
  });
});
