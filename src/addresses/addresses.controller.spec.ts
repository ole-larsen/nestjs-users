import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import mockUserRepositoryProvider from "../users/test/mock.repository";
import mockAddressRepositoryProvider, {mockAddresses} from "./test/mock.repository";
import {HttpException} from "@nestjs/common";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";
import {CreateEntityDto} from "./dto/create-entity.dto";
import {UpdateEntityDto} from "./dto/update-entity.dto";
import {UpdateEntityResponseDto} from "./dto/update-entity-response.dto";
import {ConfigService} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";
import mockRoleRepositoryProvider from "../roles/test/mock.repository";

describe('AddressesController', () => {
  let controller: AddressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule
      ],
      controllers: [AddressesController],
      providers: [
        ConfigService,
        AddressesService,
        mockUserRepositoryProvider(),
        mockRoleRepositoryProvider(),
        mockAddressRepositoryProvider(),
      ],
    }).compile();

    controller = module.get<AddressesController>(AddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('method findAll should be defined', () => {
    expect(controller.findAll).toBeDefined();
  });

  it('describe findAll method', async () => {
    const units = await controller.findAll();
    expect(units.list.length).toBe(mockAddresses.length);
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
      await controller.create(createEntityDto);
      expect(mockAddresses[mockAddresses.length - 1].address_type === createEntityDto.addressType);
    } catch(e) {
      expect(e).toBe(undefined);
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
    updateEntityDto.addressType = 'main';
    updateEntityDto.country = 'Russia';
    updateEntityDto.region = 'Moscow';
    updateEntityDto.district = 'Moscow';
    updateEntityDto.city = 'Moscow';
    updateEntityDto.zip = 1112222;
    updateEntityDto.street = 'Kremlin';
    updateEntityDto.house = '1';
    updateEntityDto.block = 'A';
    updateEntityDto.apartments = '1';
    updateEntityDto.additional = 'some additional information';
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

      expect(mockAddresses[3].enabled).toBe(false);
      expect(!!mockAddresses[3].deleted).toBe(true);

    } catch (e) {
      expect(e).toBe(undefined);
    }
    // cannot delete twice
  });
});
