import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {UsersController} from "./users.controller";
import mockUserRepositoryProvider, {mockUsers} from "./test/mock.repository";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";

import {HttpException} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {compare, hash} from "./helpers/hash";
import {UpdateUserDto} from "./dto/update-user.dto";
import {AuthService} from "../auth/auth.service";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import mockRoleRepositoryProvider from "../roles/test/mock.repository";
import {User} from "./entities/user.entity";
import {TwoFactorAuthenticationService} from "../auth/services/two-factor-authentication.service";
import {HttpModule} from "@nestjs/axios";

describe('UsersService', () => {
  let service: UsersService;
  beforeAll(async () => {
    await Promise.all(mockUsers.map(async (user: User) => {
      user.password = await hash(user.password);
      return user;
    }));
  })
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule
      ],
      controllers: [UsersController],
      providers: [
        JwtService,
        ConfigService,
        AuthService,
        UsersService,
        TwoFactorAuthenticationService,
        mockUserRepositoryProvider(),
        mockRoleRepositoryProvider(),
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('method should be defined', () => {
    expect(service.findAll).toBeDefined();
  });

  it('describe findAll method', async () => {
    const units = await service.findAll();
    expect(units.list.length).toBe(mockUsers.length)
  });
  it('method should be defined', () => {
    expect(service.findOne).toBeDefined();
  });

  it('describe findOne method', async () => {
    const id = 1;
    const user = await service.findOne(id);
    expect(user.id).toBe(id);
  });

  it('describe findOne method with invalid parameters', async () => {
    const id = 100;
    try {
      await service.findOne(id);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE);
    }
  });

  it('method should be defined', () => {
    expect(service.create).toBeDefined();
  });

  it('describe create method with invalid parameters', async () => {
    const user = new CreateUserDto();
    try {
      await service.create(user);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.USER_INVALID_PARAMETERS_EXCEPTION_MESSAGE);
    }
  });

  it('describe create method with invalid parameters', async () => {
    const user = new CreateUserDto();
    user.email = 'example@gmail.com';
    try {
      await service.create(user);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.USER_INVALID_PARAMETERS_EXCEPTION_MESSAGE);
    }
  });

  it('describe create method with valid parameters', async () => {
    const createUserDto = new CreateUserDto();

    createUserDto.email = 'first@gmail.com';
    createUserDto.password = 'example password';
    createUserDto.repeat = 'example password';
    createUserDto.roles = ['user'];

    try {
      const { id } = await service.create(createUserDto);
      const createdUser = await service.findOne(id);
      expect(await compare('example password', createdUser.password)).toBe(true);
      expect(createdUser.id).toBe(id);
    } catch (e) {
      console.log(e);
    }
  });

  it('method should be defined', () => {
    expect(service.update).toBeDefined();
  });

  it('describe update method with valid parameters', async () => {
    const userId = 11;
    const updateUserDto = new UpdateUserDto();

    updateUserDto.email = 'updated_example@gmail.com';
    updateUserDto.enabled = false;
    updateUserDto.roles = ['admin'];

    try {
      const { id } = await service.update(userId, updateUserDto);

      const user = await service.findOne(id);

      expect(id).toBe(userId);
      const updated = await service.findOne(userId);
      expect(updated.email).toBe(user.email);
    } catch(e) {
      console.error(e.message);
    }
  });

  it('describe update method with valid parameters to change password', async () => {
    const user = new UpdateUserDto();
    const userId = 11;
    user.email = 'updated_example777@gmail.com';
    user.enabled = false;
    user.password = 'new strong password';
    user.repeat = 'new strong password';
    user.roles = ['user'];
    try {
      const { id } = await service.update(userId, JSON.parse(JSON.stringify(user)));
      expect(id).toBe(userId);
      const updated = await service.findOne(userId);

      expect(updated.email).toBe(user.email);
      expect(await compare(user.password, updated.password)).toBe(true);
    } catch (e) {
      console.log(e);
    }
  });

  it('describe update method with valid parameters to check password', async () => {
    const user = new UpdateUserDto();
    const userId = 11;
    user.email = 'updated_example@gmail.com';
    user.enabled = false;
    user.password = 'new strong password1';
    user.repeat = 'new strong password';
    user.roles = ['user'];

    try {
      await service.update(userId, user);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.USER_PASSWORD_IS_NOT_MATCH);
    }
  });

  it('method should be defined', () => {
    expect(service.remove).toBeDefined();
  });

  it('method should be defined', () => {
    expect(service.forgotPassword).toBeDefined();
  });

  it('method should be defined', () => {
    expect(service.findOneByToken).toBeDefined();
  });

  it('method should be defined', () => {
    expect(service.resetPassword).toBeDefined();
  });
});
