import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import mockUserRepositoryProvider from "../users/test/mock.repository";
import mockAddressRepositoryProvider, {mockAddresses} from "./test/mock.repository";

import {HttpException} from "@nestjs/common";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";
import {CreateEntityDto} from "./dto/create-entity.dto";
import {UpdateEntityDto} from "./dto/update-entity.dto";
import {UpdateEntityResponseDto} from "./dto/update-entity-response.dto";
import {DeleteEntityResponseDto} from "./dto/delete-entity-response.dto";
import {ConfigService} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";
import mockRoleRepositoryProvider from "../roles/test/mock.repository";

describe('AddressesService', () => {
  let service: AddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        ConfigService,
        AddressesService,
        mockUserRepositoryProvider(),
        mockRoleRepositoryProvider(),
        mockAddressRepositoryProvider(),
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('method findAll should be defined', () => {
    expect(service.findAll).toBeDefined();
  });

  it('describe findAll method should be defined', async () => {
    const entities = await service.findAll();
    expect(entities.list.length).toEqual(mockAddresses.length);
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

  it('describe create method with invalid userId parameter', async () => {
    const createEntityDto = new CreateEntityDto();
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
    createEntityDto.userId = 1;
    createEntityDto.addressType = 'main';
    createEntityDto.country = 'Russia';
    createEntityDto.region = 'Saint-Petersburg';
    createEntityDto.district = 'Saint-Petersburg';
    createEntityDto.city = 'Saint-Petersburg';
    createEntityDto.zip = 1112222;
    createEntityDto.street = 'Nevsky Prospekt';
    createEntityDto.house = '71';
    createEntityDto.block = 'A';
    createEntityDto.apartments = '56';
    createEntityDto.additional = 'some additional information';
    createEntityDto.enabled = true;
    try {
      await service.create(createEntityDto);
      expect(mockAddresses[mockAddresses.length - 1].city).toBe(createEntityDto.city);
    } catch (e) {
      expect(e).toBe(undefined);
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
  
  it('describe update method with valid id and username parameters', async () => {
    const id = 10;
    const updateEntityDto = new UpdateEntityDto();
    updateEntityDto.addressType = 'main';
    updateEntityDto.country = 'Russia';
    updateEntityDto.region = 'Saint-Petersburg';
    updateEntityDto.district = 'Saint-Petersburg';
    updateEntityDto.city = 'Saint-Petersburg';
    updateEntityDto.zip = 1112222;
    updateEntityDto.street = 'Nevsky Prospekt';
    updateEntityDto.house = '71';
    updateEntityDto.block = 'A';
    updateEntityDto.apartments = '56';
    updateEntityDto.additional = 'some more additional information';
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
    const id = 3;
    try {
      const response = await service.remove(id);
      expect(response instanceof DeleteEntityResponseDto).toBe(true);
      expect(response.id).toBe(id);
    } catch (e) {
      expect(e).toBe(undefined);
    }
  });
});
