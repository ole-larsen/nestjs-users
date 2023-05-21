import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import {JwtService} from "@nestjs/jwt";
import {AuthService} from "./auth.service";
import {UsersService} from "../users/users.service";
import mockUserRepositoryProvider, {mockUsers} from "../users/test/mock.repository";
import {ConfigService} from "@nestjs/config";
import {SignInDto} from "./dto/sign-in.dto";
import {User} from "../users/entities/user.entity";
import {hash} from "../users/helpers/hash";
import mockRoleRepositoryProvider from "../roles/test/mock.repository";
import {HttpException} from "@nestjs/common";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";
import {TwoFactorAuthenticationService} from "./services/two-factor-authentication.service";
import {HttpModule} from "@nestjs/axios";
import {VerifyDto} from "./dto/verify.dto";


describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        ConfigService,
        JwtService,
        AuthService,
        UsersService,
        TwoFactorAuthenticationService,
        mockUserRepositoryProvider(),
        mockRoleRepositoryProvider(),
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('method should be defined', () => {
    expect(controller.signIn).toBeDefined();
  });

  it('describe signIn method', async () => {
    try {
      await Promise.all(mockUsers.map(async (user: User) => {
        user.password = await hash(user.password);
        return user;
      }));

      const credentials = new SignInDto();
      credentials.email = 'example2@gmail.com';
      credentials.password = 'some random password';
      const { access_token } = await controller.signIn(credentials);

      expect(!!access_token).toBe(true);
    } catch (e) {
      expect(e instanceof HttpException);
      expect(e.message).toBe(HttpExceptionMessages.NOT_VERIFIED);
    }
  });

  it('method verify should be defined', () => {
    expect(controller.verify).toBeDefined();
  });

  it('describe verify method', async () => {
    try {
      const verifyDto = new VerifyDto();
      await controller.verify(verifyDto);
    } catch (e) {
      expect(e instanceof HttpException);
      expect(e.message).toBe(HttpExceptionMessages.USER_NOT_FOUND);
    }
  });

  it('describe verify method with valid parameters', async () => {
    try {
      const verifyDto = new VerifyDto();
      verifyDto.code = 1 + '_this_is_the_code';
      await controller.verify(verifyDto);
    } catch (e) {
      expect(e instanceof HttpException);
      expect(e.message).toBe(HttpExceptionMessages.USER_NOT_FOUND);
    }
  });

  it('method verifyOtp should be defined', () => {
    expect(controller.verifyOTP).toBeDefined();
  });

  it('method callback should be defined', () => {
    expect(controller.callback).toBeDefined();
  });

  it('method forgotPassword should be defined', () => {
    expect(controller.forgotPassword).toBeDefined();
  });

  it('method resetPassword should be defined', () => {
    expect(controller.resetPassword).toBeDefined();
  });
});
