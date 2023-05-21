import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";

import { Profile} from "./entities/profile.entity";
import { HttpExceptionMessages } from "./dto/exceptions/http-exception-messages.constants";
import { GetEntitiesResponseDto } from "./dto/get-entities.response.dto";
import { CreateEntityResponseDto } from "./dto/create-entity-response.dto";
import { UpdateEntityResponseDto } from "./dto/update-entity-response.dto";
import { DeleteEntityResponseDto } from "./dto/delete-entity-response.dto";
import * as moment from "moment";

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {
    this.usersRepository = usersRepository;
    this.profilesRepository = profilesRepository;
  }

  async findAll(): Promise<GetEntitiesResponseDto> {
    try {
      const profiles = await this.profilesRepository.find({ withDeleted: false });
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

  async findOne(id: number): Promise<Profile | null> {
    try {
      const exists = await this.profilesRepository.findOneBy( { id, deleted: null } );
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
      if (!createEntityDto.username) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE,
          HttpStatus.BAD_REQUEST,
        );
      }

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

      const exists = await this.profilesRepository.findOneBy({ username: createEntityDto.username });
      if (exists) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE,
          HttpStatus.CONFLICT,
        );
      }

      const entity = new Profile();
      entity.user_id = createEntityDto.userId;
      entity.username = createEntityDto.username;
      entity.first_name = createEntityDto.firstName;
      entity.last_name = createEntityDto.lastName;
      entity.birthdate = moment(createEntityDto.birthdate, 'DD-MM-YYYY').toDate();
      entity.about = createEntityDto.about;
      entity.enabled = createEntityDto.enabled;

      await this.profilesRepository.save(entity);

      const created = await this.profilesRepository.findOneBy({ username: createEntityDto.username });
      user.profile = created;
      await this.usersRepository.save(user);
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
      const exists = await this.profilesRepository.findOneBy( { id });
      if (!exists) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE,
          HttpStatus.NOT_FOUND,
        );
      }

      if (!updateEntityDto.username) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE,
          HttpStatus.BAD_REQUEST,
        );
      }

      const existsByTitle = await this.profilesRepository.findOneBy({ username: updateEntityDto.username });
      if (existsByTitle && existsByTitle.id !== id) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE,
          HttpStatus.CONFLICT,
        );
      }

      const user = await this.usersRepository.findOneBy({ id: updateEntityDto.userId });

      if (!user) {
        throw new HttpException(
          HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.profilesRepository.update(id, updateEntityDto);

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
      const exists = await this.profilesRepository.findOneBy( { id });
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
      await this.profilesRepository.softDelete(id);

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
}
