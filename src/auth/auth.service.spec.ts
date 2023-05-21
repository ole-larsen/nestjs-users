import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import {UsersService} from "../users/users.service";
import mockUserRepositoryProvider, {mockUsers} from "../users/test/mock.repository";
import {JwtService} from "@nestjs/jwt";
import {HttpException} from "@nestjs/common";
import {User} from "../users/entities/user.entity";
import {hash} from "../users/helpers/hash";
import {ConfigService} from "@nestjs/config";
import mockRoleRepositoryProvider from "../roles/test/mock.repository";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";
import {TwoFactorAuthenticationService} from "./services/two-factor-authentication.service";
import {HttpModule} from "@nestjs/axios";

describe('AuthService', () => {
  let service: AuthService;

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
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signIn method should be defined', () => {
    expect(service.signIn).toBeDefined();
  });

  it('describe signIn method with not found user', async () => {
    try {
      await service.signIn('example@gmail.com', 'changeme');
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe(HttpExceptionMessages.USER_NOT_FOUND);
    }
  });

  it('describe signIn method with existing user', async () => {
    try {
      await service.signIn('example2@gmail.com', 'changeme');
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.message).toBe("Unauthorized");
    }
  });

  it('describe signIn method with existing user', async () => {
    try {
      await Promise.all(mockUsers.map(async (user: User) => {
        user.password = await hash(user.password);
        return user;
      }));

      const { access_token } = await service.signIn('example2@gmail.com', 'some random password');
      expect(access_token.length > 0).toBe(true);
    } catch (e) {
      expect(e instanceof HttpException);
      expect(e.message).toBe(HttpExceptionMessages.NOT_VERIFIED);
    }
  });

  it('verify method should be defined', () => {
    expect(service.verify).toBeDefined();
  });

  it('validateUser method should be defined', () => {
    expect(service.validateUser).toBeDefined();
  });

  it('verifyTwoFactorAuthenticationCode method should be defined', () => {
    expect(service.verifyTwoFactorAuthenticationCode).toBeDefined();
  });

  it('oauthAuthenticate method should be defined', () => {
    expect(service.oauthAuthenticate).toBeDefined();
  });

  it('forgotPassword method should be defined', () => {
    expect(service.forgotPassword).toBeDefined();
  });
});
