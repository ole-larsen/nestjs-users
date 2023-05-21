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
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {ApiBody, ApiExtraModels, ApiTags} from "@nestjs/swagger";
import {ExceptionResponse, SuccessResponse} from "../common/dto";
import {ApiSuccessfulResponse} from "../decorators/api-successful-response.decorator";
import {ApiExceptionResponse} from "../decorators/api-exception-response.decorator";
import {PaginationQuery} from "../decorators/swagger/pagination-query.decorator";
import {CreateUserResponseDto} from "./dto/create-user-response.dto";
import {UpdateUserResponseDto} from "./dto/update-user-response.dto";
import {GetUsersResponseDto} from "./dto/get-users-response.dto";
import {GetUserResponseDto} from "./dto/get-user-response.dto";
import {DeleteUserResponseDto} from "./dto/delete-user-response.dto";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";
import {CreateUserFailedException} from "./dto/exceptions/create-user-failed.exception";
import {UserAlreadyExistsException} from "./dto/exceptions/user-already-exists.exception";
import {UpdateUserFailedException} from "./dto/exceptions/update-role-failed.exception";
import {GetUsersFailedException} from "./dto/exceptions/get-users-failed.exception";
import {GetUserFailedException} from "./dto/exceptions/get-user-failed.exception";
import {UserNotFoundException} from "./dto/exceptions/user-not-found.exception";
import {UserAlreadyDeletedException} from "./dto/exceptions/user-already-deleted.exception";
import {UserPasswordNotMatchException} from "./dto/exceptions/password-not-match.exception";
import {Public} from "../decorators/api-public.decorator";
import {Roles} from "../roles/decorators/roles.decorator";
import {SystemRole} from "../roles/roles.enum";
import {OtpAuthGuard} from "../auth/guards/otp-auth.guard";
import {RolesGuard} from "../auth/guards/roles.guards";

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1'
})
@ApiExtraModels(
  SuccessResponse,
  ExceptionResponse,
  CreateUserDto,
  CreateUserResponseDto,
  CreateUserFailedException,
  UserAlreadyExistsException,
  UpdateUserDto,
  UpdateUserResponseDto,
  UpdateUserFailedException,
  UserPasswordNotMatchException,
  GetUsersResponseDto,
  GetUsersFailedException,
  GetUserResponseDto,
  GetUserFailedException,
  UserNotFoundException,
  DeleteUserResponseDto,
  UserAlreadyDeletedException
)
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    this.usersService = usersService;
  }

  @Post()
  @ApiBody({
    type: CreateUserDto,
  })
  @UsePipes(new ValidationPipe())
  @ApiSuccessfulResponse(
    HttpStatus.CREATED,
    HttpExceptionMessages.CREATE_USER_RESPONSE_MESSAGE,
    CreateUserResponseDto,
  )
  @ApiExceptionResponse(
    HttpStatus.BAD_REQUEST,
    HttpExceptionMessages.USER_PASSWORD_IS_NOT_MATCH,
    CreateUserFailedException,
  )
  @ApiExceptionResponse(
    HttpStatus.BAD_REQUEST,
    HttpExceptionMessages.CREATE_USER_FAILED_EXCEPTION_MESSAGE,
    CreateUserFailedException,
  )
  @ApiExceptionResponse(
    HttpStatus.BAD_REQUEST,
    HttpExceptionMessages.USER_INVALID_PARAMETERS_EXCEPTION_MESSAGE,
    CreateUserFailedException,
  )
  @ApiExceptionResponse(
    HttpStatus.CONFLICT,
    HttpExceptionMessages.USER_ALREADY_EXISTS_EXCEPTION_MESSAGE,
    UserAlreadyExistsException,
  )
  @Public()
  create(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiBody({
    type: UpdateUserDto,
  })
  @UsePipes(new ValidationPipe())
  @ApiSuccessfulResponse(
    HttpStatus.OK,
    HttpExceptionMessages.UPDATE_USER_RESPONSE_MESSAGE,
    UpdateUserResponseDto,
  )
  @ApiExceptionResponse(
    HttpStatus.NOT_FOUND,
    HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE,
    UserNotFoundException,
  )
  @ApiExceptionResponse(
    HttpStatus.BAD_REQUEST,
    HttpExceptionMessages.USER_INVALID_PARAMETERS_EXCEPTION_MESSAGE,
    UpdateUserFailedException,
  )
  @ApiExceptionResponse(
    HttpStatus.BAD_REQUEST,
    HttpExceptionMessages.USER_PASSWORD_IS_NOT_MATCH,
    UpdateUserFailedException,
  )
  @ApiExceptionResponse(
    HttpStatus.CONFLICT,
    HttpExceptionMessages.USER_ALREADY_EXISTS_EXCEPTION_MESSAGE,
    UserAlreadyExistsException,
  )
  @UseGuards(OtpAuthGuard, RolesGuard)
  @Roles(SystemRole.Superadmin, SystemRole.Admin)
  update(@Param('id') id: string | number, @Body() updateUserDto: UpdateUserDto): Promise<UpdateUserResponseDto> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Get()
  @PaginationQuery(false)
  @UsePipes(new ValidationPipe())
  @ApiSuccessfulResponse(
    HttpStatus.OK,
    HttpExceptionMessages.GET_USERS_RESPONSE_MESSAGE,
    GetUsersResponseDto,
  )
  @ApiExceptionResponse(
    HttpStatus.BAD_REQUEST,
    HttpExceptionMessages.GET_USERS_LIST_FAILED_EXCEPTION_MESSAGE,
    GetUsersFailedException,
  )
  @Public()
  findAll(): Promise<GetUsersResponseDto> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  @ApiSuccessfulResponse(
    HttpStatus.OK,
    HttpExceptionMessages.GET_USER_RESPONSE_MESSAGE,
    GetUserResponseDto,
  )
  @ApiExceptionResponse(
    HttpStatus.BAD_REQUEST,
    HttpExceptionMessages.GET_USER_FAILED_EXCEPTION_MESSAGE,
    GetUserFailedException,
  )
  @ApiExceptionResponse(
    HttpStatus.NOT_FOUND,
    HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE,
    UserNotFoundException,
  )
  @UseGuards(OtpAuthGuard, RolesGuard)
  @Roles(SystemRole.Superadmin, SystemRole.Admin, SystemRole.User, SystemRole.Manager)
  findOne(@Param('id') id: string | number): Promise<GetUserResponseDto> {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @ApiSuccessfulResponse(
    HttpStatus.OK,
    HttpExceptionMessages.DELETE_USER_RESPONSE_MESSAGE,
    DeleteUserResponseDto,
  )
  @ApiExceptionResponse(
    HttpStatus.NOT_FOUND,
    HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE,
    UserNotFoundException,
  )
  @ApiExceptionResponse(
    HttpStatus.CONFLICT,
    HttpExceptionMessages.DELETE_USER_FAILED_EXCEPTION_MESSAGE,
    UserAlreadyDeletedException,
  )
  @UseGuards(OtpAuthGuard, RolesGuard)
  @Roles(SystemRole.Superadmin)
  remove(@Param('id') id: string | number): Promise<DeleteUserResponseDto> {
    return this.usersService.remove(+id);
  }
}