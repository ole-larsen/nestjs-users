import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import mockUserRepositoryProvider, {mockUsers} from "./test/mock.repository";
import {HttpException} from "@nestjs/common";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import mockRoleRepositoryProvider from "../roles/test/mock.repository";
import {MailerService} from "@nestjs-modules/mailer";

import mockMailerOptionsProvider from "../auth/test/mock.mailer.options";
import {TwoFactorAuthenticationService} from "../auth/services/two-factor-authentication.service";
import {HttpModule} from "@nestjs/axios";

describe('UsersController', () => {
  let controller: UsersController;

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

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('method should be defined', () => {
    expect(controller.findAll).toBeDefined();
  });

  it('method should be defined', () => {
    expect(controller.findOne).toBeDefined();
  });

  it('method should be defined', () => {
    expect(controller.create).toBeDefined();
  });

  it('method should be defined', () => {
    expect(controller.update).toBeDefined();
  });

  it('method should be defined', () => {
    expect(controller.remove).toBeDefined();
  });

  it('describe findAll method', async () => {
    const units = await controller.findAll();
    expect(units.list.length).toBe(mockUsers.length);
  });

  it('describe findOne method', async () => {
    try {
      const unit = await controller.findOne(100);
      expect(unit).toBe(null);
    } catch(e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE);
    }
  });

  it('describe findOne method', async () => {
    const unit = await controller.findOne(1);
    expect(unit.id).toBe(1);
  });

  it('describe create method with empty parameters', async () => {
    const user = new CreateUserDto();
    try {
      await controller.create(user);
    } catch(e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.USER_INVALID_PARAMETERS_EXCEPTION_MESSAGE);
    }
  });

  it('describe create exists method with parameters', async () => {
    const user = new CreateUserDto();
    user.email = 'example1@gmail.com';
    user.password = '12345';
    user.repeat = '12345';
    try {
      await controller.create(user);
    } catch(e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.USER_ALREADY_EXISTS_EXCEPTION_MESSAGE);
    }
  });

  it('describe create method with correct parameters', async () => {
    const user = new CreateUserDto();
    user.email = 'example12@gmail.com';
    try {
      await controller.create(user);
      expect(mockUsers[mockUsers.length - 1].email = user.email);
    } catch(e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.USER_INVALID_PARAMETERS_EXCEPTION_MESSAGE);
    }
  });

  it('describe non exists update method', async () => {
    const user = new UpdateUserDto();
    try {
      await controller.update(112, user);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE);
    }
  });

  it('describe exists update method with invalid parameters', async () => {
    const user = new UpdateUserDto();
    try {
      await controller.update(3, user);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.USER_INVALID_PARAMETERS_EXCEPTION_MESSAGE);
    }
  });

  it('describe exists update method with valid parameters', async () => {
    // const user = new UpdateUserDto();
    // user.email = 'updated1@gmail.com';
    // user.enabled = true;
    // user.roles = ['admin'];
    //
    // try {
    //   await controller.update(3, user);
    //
    //   expect(mockUsers[3].email).toBe(user.email);
    // } catch (e) {
    //   expect(e).toBe(undefined);
    // }
    // try {
    //   await controller.update(4, user);
    // } catch (e) {
    //   expect(e instanceof HttpException).toBe(true);
    //   expect(e.message).toBe(HttpExceptionMessages.USER_ALREADY_EXISTS_EXCEPTION_MESSAGE);
    // }
  });

  it('describe remove method with valid parameters', async () => {
    const id = 3;
    try {
      await controller.remove(id);

      expect(mockUsers[3].enabled).toBe(false);
      expect(!!mockUsers[3].deleted).toBe(true);

    } catch (e) {
      expect(e).toBe(undefined);
    }
    // cannot delete twice
  });
});
