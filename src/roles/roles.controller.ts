import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {RolesService} from './roles.service';
import {CreateEntityDto} from './dto/create-entity.dto';
import {UpdateEntityDto} from './dto/update-entity.dto';
import {ApiBody, ApiExtraModels, ApiTags} from "@nestjs/swagger";
import {ApiSuccessfulResponse} from "../decorators/api-successful-response.decorator";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";
import {CreateEntityResponseDto} from "./dto/create-entity-response.dto";
import {ApiExceptionResponse} from "../decorators/api-exception-response.decorator";
import {CreateEntityFailedException} from "./dto/exceptions/create-entity-failed.exception";
import {EntityAlreadyExistsException} from "./dto/exceptions/entity-already-exists.exception";
import {ExceptionResponse, SuccessResponse} from "../common/dto";
import {UpdateEntityResponseDto} from "./dto/update-entity-response.dto";
import {UpdateEntityFailedException} from "./dto/exceptions/update-entity-failed.exception";

import {PaginationQuery} from "../decorators/swagger/pagination-query.decorator";
import {GetEntitiesResponseDto} from "./dto/get-entities.response.dto";
import {GetEntitiesFailedException} from "./dto/exceptions/get-entities-failed.exception";
import {GetEntityResponseDto} from "./dto/get-entity-response.dto";
import {GetEntityFailedException} from "./dto/exceptions/get-entity-failed.exception";
import {EntityNotFoundException} from "./dto/exceptions/entity-not-found.exception";
import {DeleteEntityResponseDto} from "./dto/delete-entity-response.dto";
import {EntityAlreadyDeletedException} from "./dto/exceptions/entity-already-deleted.exception";
import {Roles} from "./decorators/roles.decorator";
import {SystemRole} from "./roles.enum";
import {Public} from "../decorators/api-public.decorator";
import {OtpAuthGuard} from "../auth/guards/otp-auth.guard";
import {RolesGuard} from "../auth/guards/roles.guards";

@ApiTags('roles')
@Controller({
  path: 'roles',
  version: '1'
})
@ApiExtraModels(
  SuccessResponse,
  ExceptionResponse,
  CreateEntityDto,
  CreateEntityResponseDto,
  CreateEntityFailedException,
  EntityAlreadyExistsException,
  UpdateEntityDto,
  UpdateEntityResponseDto,
  UpdateEntityFailedException,
  GetEntitiesResponseDto,
  GetEntitiesFailedException,
  GetEntityResponseDto,
  GetEntityFailedException,
  EntityNotFoundException,
  DeleteEntityResponseDto,
  EntityAlreadyDeletedException
)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {
    this.rolesService = rolesService;
  }

  @Post()
  @ApiBody({
    type: CreateEntityDto,
  })
  @UsePipes(new ValidationPipe())
  @ApiSuccessfulResponse(
    HttpStatus.CREATED,
    HttpExceptionMessages.CREATE_ENTITY_RESPONSE_MESSAGE,
    CreateEntityResponseDto,
  )
  @ApiExceptionResponse(
    HttpStatus.BAD_REQUEST,
    HttpExceptionMessages.CREATE_ENTITY_FAILED_EXCEPTION_MESSAGE,
    CreateEntityFailedException,
  )
  @ApiExceptionResponse(
    HttpStatus.BAD_REQUEST,
    HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE,
    CreateEntityFailedException,
  )
  @ApiExceptionResponse(
    HttpStatus.CONFLICT,
    HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE,
    EntityAlreadyExistsException,
  )
  @UseGuards(OtpAuthGuard, RolesGuard)
  @Roles(SystemRole.Superadmin, SystemRole.Admin)
  create(@Body() createEntityDto: CreateEntityDto): Promise<CreateEntityResponseDto> {
    return this.rolesService.create(createEntityDto);
  }

  @Patch(':id')
  @ApiBody({
    type: UpdateEntityDto,
  })
  @UsePipes(new ValidationPipe())
  @ApiSuccessfulResponse(
    HttpStatus.OK,
    HttpExceptionMessages.UPDATE_ENTITY_RESPONSE_MESSAGE,
    UpdateEntityResponseDto,
  )
  @ApiExceptionResponse(
    HttpStatus.NOT_FOUND,
    HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE,
    EntityNotFoundException,
  )
  @ApiExceptionResponse(
    HttpStatus.BAD_REQUEST,
    HttpExceptionMessages.ENTITY_INVALID_PARAMETERS_EXCEPTION_MESSAGE,
    UpdateEntityFailedException,
  )
  @ApiExceptionResponse(
    HttpStatus.CONFLICT,
    HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE,
    EntityAlreadyExistsException,
  )
  @UseGuards(OtpAuthGuard, RolesGuard)
  @Roles(SystemRole.Superadmin, SystemRole.Admin)
  update(@Param('id') id: string | number, @Body() updateEntityDto: UpdateEntityDto): Promise<UpdateEntityResponseDto> {
    return this.rolesService.update(+id, updateEntityDto);
  }

  @Get()
  @PaginationQuery(false)
  @UsePipes(new ValidationPipe())
  @ApiSuccessfulResponse(
    HttpStatus.OK,
    HttpExceptionMessages.GET_ENTITIES_RESPONSE_MESSAGE,
    GetEntitiesResponseDto,
  )
  @ApiExceptionResponse(
    HttpStatus.BAD_REQUEST,
    HttpExceptionMessages.GET_ENTITIES_LIST_FAILED_EXCEPTION_MESSAGE,
    GetEntitiesFailedException,
  )
  @Public()
  findAll(): Promise<GetEntitiesResponseDto> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  @ApiSuccessfulResponse(
    HttpStatus.OK,
    HttpExceptionMessages.GET_ENTITY_RESPONSE_MESSAGE,
    GetEntityResponseDto,
  )
  @ApiExceptionResponse(
    HttpStatus.BAD_REQUEST,
    HttpExceptionMessages.GET_ENTITY_FAILED_EXCEPTION_MESSAGE,
    GetEntityFailedException,
  )
  @ApiExceptionResponse(
    HttpStatus.NOT_FOUND,
    HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE,
    EntityNotFoundException,
  )
  @UseGuards(OtpAuthGuard, RolesGuard)
  @Roles(SystemRole.Superadmin, SystemRole.Admin, SystemRole.User, SystemRole.Manager)
  findOne(@Param('id') id: string | number): Promise<GetEntityResponseDto> {
    return this.rolesService.findOne(+id);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @ApiSuccessfulResponse(
    HttpStatus.OK,
    HttpExceptionMessages.DELETE_ENTITY_RESPONSE_MESSAGE,
    DeleteEntityResponseDto,
  )
  @ApiExceptionResponse(
    HttpStatus.NOT_FOUND,
    HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE,
    EntityNotFoundException,
  )
  @ApiExceptionResponse(
    HttpStatus.CONFLICT,
    HttpExceptionMessages.DELETE_ENTITY_FAILED_EXCEPTION_MESSAGE,
    EntityAlreadyDeletedException,
  )
  @UseGuards(OtpAuthGuard, RolesGuard)
  @Roles(SystemRole.Superadmin)
  remove(@Param('id') id: string | number): Promise<DeleteEntityResponseDto> {
    return this.rolesService.remove(+id);
  }
}
