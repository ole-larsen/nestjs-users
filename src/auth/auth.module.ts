import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from "../users/users.service";
import { UsersModule } from "../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { LocalStrategy } from "./strategies/local.strategy";

import { ConfigModule } from "@nestjs/config";
import configDefault from "../config/default";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { Role } from "../roles/entities/role.entity";
import { OtpStrategy } from "./strategies/otp.strategy";
import { TwoFactorAuthenticationService } from "./services/two-factor-authentication.service";
import { HttpModule } from "@nestjs/axios";
import {APP_GUARD} from "@nestjs/core";
import {OtpAuthGuard} from "./guards/otp-auth.guard";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      load: [configDefault],
    }),
    TypeOrmModule.forFeature([User, Role]),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' },
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    OtpStrategy,
    JwtStrategy,
    LocalStrategy,
    AuthService,
    UsersService,
    TwoFactorAuthenticationService
  ],
})
export class AuthModule {}
