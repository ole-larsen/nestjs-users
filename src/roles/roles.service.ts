import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { Repository } from "typeorm";
import { HttpExceptionMessages } from "./dto/exceptions/http-exception-messages.constants";
import { CreateEntityResponseDto } from "./dto/create-entity-response.dto";
import { UpdateEntityResponseDto } from "./dto/update-entity-response.dto";
import { GetEntitiesResponseDto } from "./dto/get-entities.response.dto";
import { DeleteEntityResponseDto } from "./dto/delete-entity-response.dto";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {
    this.rolesRepository = rolesRepository;
  }

  async findAll(): Promise<GetEntitiesResponseDto> {
    try {
      const roles = await this.rolesRepository.find({ withDeleted: false });
      const response = new GetEntitiesResponseDto();
      response.list = roles;
      return response;
    } catch (e) {
      throw new HttpException(
        HttpExceptionMessages.GET_ENTITIES_LIST_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number): Promise<Role | null> {
    try {
      const exists = await this.rolesRepository.findOneBy( { id, deleted: null } );
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
      if (!createEntityDto.title) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE,
          HttpStatus.BAD_REQUEST,
        );
      }
      const exists = await this.rolesRepository.findOneBy({ title: createEntityDto.title });
      if (exists) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE,
          HttpStatus.CONFLICT,
        );
      }

      const role = new Role();
      role.title = createEntityDto.title;
      role.description = createEntityDto.description;

      await this.rolesRepository.save(createEntityDto);

      const created = await this.rolesRepository.findOneBy({ title: createEntityDto.title });

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
      const exists = await this.rolesRepository.findOneBy( { id });
      if (!exists) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE,
          HttpStatus.NOT_FOUND,
        );
      }

      if (!updateEntityDto.title) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE,
          HttpStatus.BAD_REQUEST,
        );
      }

      const existsByTitle = await this.rolesRepository.findOneBy({ title: updateEntityDto.title });
      if (existsByTitle && existsByTitle.id !== id) {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE,
          HttpStatus.CONFLICT,
        );
      }
      await this.rolesRepository.update(id, updateEntityDto);

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
      const exists = await this.rolesRepository.findOneBy( { id });
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
      await this.rolesRepository.softDelete(id);

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
