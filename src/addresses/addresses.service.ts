import {HttpException, HttpStatus, Injectable} from '@nestjs/common';

import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../users/entities/user.entity";
import {Address} from "./entities/address.entity";
import {GetEntitiesResponseDto} from "./dto/get-entities.response.dto";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";
import {CreateEntityDto} from "./dto/create-entity.dto";
import {CreateEntityResponseDto} from "./dto/create-entity-response.dto";
import {UpdateEntityDto} from "./dto/update-entity.dto";
import {UpdateEntityResponseDto} from "./dto/update-entity-response.dto";
import {DeleteEntityResponseDto} from "./dto/delete-entity-response.dto";

import {ConfigService} from "@nestjs/config";
import {HttpService} from "@nestjs/axios";
import * as querystring from "querystring";

@Injectable()
export class AddressesService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,

  ) {
    this.configService = configService;
    this.usersRepository = usersRepository;
    this.addressesRepository = addressesRepository;
  }

  async findAll(): Promise<GetEntitiesResponseDto> {
    try {
      const profiles = await this.addressesRepository.find({ withDeleted: false });
      const response = new GetEntitiesResponseDto();
      response.list = profiles;
      return response;
    } catch (e) {
      throw new HttpException(
        HttpExceptionMessages.GET_ENTITIES_LIST_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number): Promise<Address | null> {
    try {
      const exists = await this.addressesRepository.findOneBy( { id, deleted: null } );
      if (!exists) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE,
          HttpStatus.NOT_FOUND,
        );
      }
      return exists;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.GET_ENTITY_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createEntityDto: CreateEntityDto): Promise<CreateEntityResponseDto> {
    try {

      if (!createEntityDto.userId) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE,
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.usersRepository.findOneBy({ id: createEntityDto.userId });

      if (!user) {
        throw new HttpException(
          HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE,
          HttpStatus.NOT_FOUND,
        );
      }

      const address = new Address();
      address.user_id = createEntityDto.userId;
      address.address_type = createEntityDto.addressType;
      address.country = createEntityDto.country;
      address.region = createEntityDto.region;
      address.district = createEntityDto.district;
      address.city = createEntityDto.city;
      address.zip = createEntityDto.zip;
      address.street = createEntityDto.street;
      address.house = createEntityDto.house;
      address.block = createEntityDto.block;
      address.apartments = createEntityDto.apartments;

      address.additional = createEntityDto.additional;
      address.enabled = createEntityDto.enabled;

      address.coordinates = await this.getCoordinates(`${address.country}, ${address.city}, ${address.street}+${address.house}`);

      const created = await this.addressesRepository.save(address);

      if (created) {
        return new CreateEntityResponseDto(created.id);
      }

      throw new HttpException(
        HttpExceptionMessages.CREATE_ENTITY_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );

    } catch(e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.CREATE_ENTITY_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateEntityDto: UpdateEntityDto): Promise<UpdateEntityResponseDto> {
    try {
      const exists = await this.addressesRepository.findOneBy( { id });
      if (!exists) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.addressesRepository.update(id, updateEntityDto);

      return new UpdateEntityResponseDto(id);

    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.UPDATE_ENTITY_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number): Promise<DeleteEntityResponseDto> {
    try {
      const exists = await this.addressesRepository.findOneBy( { id });
      if (!exists) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE,
          HttpStatus.NOT_FOUND,
        );
      }
      if (exists.deleted !== null) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_ALREADY_DELETED_EXCEPTION_MESSAGE,
          HttpStatus.CONFLICT,
        );
      }
      await this.addressesRepository.softDelete(id);

      return new DeleteEntityResponseDto(exists.id);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.DELETE_ENTITY_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async getCoordinates(address: string): Promise<string> {
    const url = this.configService.get<string>('YANDEX_API_BASE_URL');
    if (!url) {
      return "";
    }

    const options = {
      apikey: this.configService.get<string>('YANDEX_API_KEY'),
      format: 'json',
      geocode: address,
    }
    try {
      const { data } = await this.httpService.axiosRef.get(`${url}?${querystring.stringify(options)}`);
      const response = data.response;
      return response['GeoObjectCollection']['featureMember'][0]['GeoObject']['Point']['pos'];
    } catch (e) {
      throw e;
    }
  }
}
