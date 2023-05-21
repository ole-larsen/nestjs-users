import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from "./entities/user.entity";

import { GetUsersResponseDto } from "./dto/get-users-response.dto";

import { HttpExceptionMessages } from "./dto/exceptions/http-exception-messages.constants";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";
import { UpdateUserResponseDto } from "./dto/update-user-response.dto";
import { DeleteUserResponseDto } from "./dto/delete-user-response.dto";
import { hash } from "./helpers/hash";
import { Role } from "../roles/entities/role.entity";
import { UserDto } from "./dto/user";
import {ResetPasswordResponseDto} from "../auth/dto/reset-password-response.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {
    this.usersRepository = usersRepository;
    this.rolesRepository = rolesRepository;
  }

  private getRole(title: string): Promise<Role> {
    return this.rolesRepository
      .findOneBy({ title });
  }

  async findAll(): Promise<GetUsersResponseDto> {
    try {
      const users = await this.usersRepository.find({
        relations: {
          roles: true,
          profile: true,
          addresses: true
        },
        withDeleted: false
      });

      const response = new GetUsersResponseDto();
      response.list = users.map((user: User) => {
        // remove password and password
        const { password, secret, ...parameters } = user;
        return parameters;
      });
      return response;
    } catch (e) {
      throw new HttpException(
        HttpExceptionMessages.GET_USERS_LIST_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
      const exists = await this.usersRepository.findOne( {
        where: { id: id },
        relations: ['roles']
      });

      if (!exists) {
        throw new HttpException(
          HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE,
          HttpStatus.NOT_FOUND,
        );
      }
      const { ...user } = exists;
      return user;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.GET_USER_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneByCode(auth_confirmation_token: string): Promise<User | null> {
    try {
      const exists = await this.usersRepository.findOneBy( { auth_confirmation_token, deleted: null } );
      if (!exists) {
        throw new HttpException(
          HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE,
          HttpStatus.NOT_FOUND,
        );
      }
      return exists;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.GET_USER_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      const exists = await this.usersRepository.findOneBy( { email, deleted: null } );
      if (!exists) {
        throw new HttpException(
          HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE,
          HttpStatus.NOT_FOUND,
        );
      }
      return exists;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.GET_USER_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneByToken(token: string): Promise<User | null> {
    try {
      const exists = await this.usersRepository.findOneBy( { password_reset_token: token, deleted: null } );
      if (!exists) {
        throw new HttpException(
          HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE,
          HttpStatus.NOT_FOUND,
        );
      }
      return exists;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.GET_USER_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    try {
      if (!createUserDto.email) {
        throw new HttpException(
          HttpExceptionMessages.USER_INVALID_PARAMETERS_EXCEPTION_MESSAGE,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!createUserDto.password) {
        throw new HttpException(
          HttpExceptionMessages.USER_INVALID_PARAMETERS_EXCEPTION_MESSAGE,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!createUserDto.repeat) {
        throw new HttpException(
          HttpExceptionMessages.USER_INVALID_PARAMETERS_EXCEPTION_MESSAGE,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (createUserDto.password !== createUserDto.repeat) {
        throw new HttpException(
          HttpExceptionMessages.USER_PASSWORD_IS_NOT_MATCH,
          HttpStatus.BAD_REQUEST,
        );
      }
      const exists = await this.usersRepository.findOneBy({ email: createUserDto.email });

      if (exists) {
        throw new HttpException(
          HttpExceptionMessages.USER_ALREADY_EXISTS_EXCEPTION_MESSAGE,
          HttpStatus.CONFLICT,
        );
      }

      createUserDto.password = await hash(createUserDto.password);

      const role = await this.getRole('user');

      const user = UserDto.create(createUserDto, [role]);

      await user.setConfirmationToken();

      await this.usersRepository.save(user);

      const created = await this.usersRepository.findOneBy({ email: user.email });

      if (created) {
        return new CreateUserResponseDto(created.id, created.auth_confirmation_token);
      }

      throw new HttpException(
        HttpExceptionMessages.CREATE_USER_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    } catch(e) {
      if (e instanceof HttpException) {
        throw e;
      }
      console.log(e)
      throw new HttpException(
        HttpExceptionMessages.CREATE_USER_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateUserResponseDto> {
    try {
      const exists = await this.usersRepository.findOneBy( { id });
      if (!exists) {
        throw new HttpException(
          HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE,
          HttpStatus.NOT_FOUND,
        );
      }

      if (!updateUserDto.email) {
        throw new HttpException(
          HttpExceptionMessages.USER_INVALID_PARAMETERS_EXCEPTION_MESSAGE,
          HttpStatus.BAD_REQUEST,
        );
      }

      const existsByEmail = await this.usersRepository.findOneBy({ email: updateUserDto.email });
      if (existsByEmail && existsByEmail.id !== id) {
        throw new HttpException(
          HttpExceptionMessages.USER_ALREADY_EXISTS_EXCEPTION_MESSAGE,
          HttpStatus.CONFLICT,
        );
      }

      if (updateUserDto.password && updateUserDto.repeat && updateUserDto.password !== updateUserDto.repeat) {
        throw new HttpException(
          HttpExceptionMessages.USER_PASSWORD_IS_NOT_MATCH,
          HttpStatus.BAD_REQUEST,
        );
      }

      updateUserDto.password = (updateUserDto.password && updateUserDto.password === updateUserDto.repeat)
        ? await hash(updateUserDto.password)
        : exists.password;

      const roles = updateUserDto.roles
        ? await Promise.all(updateUserDto.roles.map((title: string) => {
            return this.rolesRepository.findOneBy({ title })
          }))
        : [await this.getRole('user')];

      const user = UserDto.update(exists, updateUserDto, roles);

      await this.usersRepository.save(user);

      return new UpdateUserResponseDto(id);

    } catch (e) {

      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.UPDATE_USER_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number): Promise<DeleteUserResponseDto> {
    try {
      const exists = await this.usersRepository.findOneBy( { id });
      if (!exists) {
        throw new HttpException(
          HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE,
          HttpStatus.NOT_FOUND,
        );
      }
      if (exists.deleted !== null) {
        throw new HttpException(
          HttpExceptionMessages.USER_ALREADY_DELETED_EXCEPTION_MESSAGE,
          HttpStatus.CONFLICT,
        );
      }
      await this.usersRepository.softDelete(id);

      return new DeleteUserResponseDto(exists.id);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.DELETE_USER_FAILED_EXCEPTION_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verify(user: User): Promise<UpdateUserResponseDto> {
    try {
      await this.usersRepository.update({ auth_confirmation_token: user.auth_confirmation_token },
        {
          verified: true,
          enabled: true,
          auth_confirmation_token: ''
        });
      return new UpdateUserResponseDto(user.id);
    } catch (e) {
      throw e;
    }
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.usersRepository.update(userId, {
      secret: secret
    });
  }

  async forgotPassword(user: User): Promise<UpdateUserResponseDto> {
    try {
      await this.usersRepository.update({ id: user.id },
        {
          password_reset_token: user.password_reset_token,
          password_reset_expires: user.password_reset_expires,
        });
      return new UpdateUserResponseDto(user.id);
    } catch (e) {
      throw e;
    }
  }

  async resetPassword(user: User): Promise<ResetPasswordResponseDto> {
    try {
      const password = await hash(user.password);
      await this.usersRepository.update({ id: user.id },
        {
          password: password,
          password_reset_token: undefined,
          password_reset_expires: undefined,
        });
      return new ResetPasswordResponseDto(user.id);
    } catch (e) {
      throw e;
    }
  }
}
