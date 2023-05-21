import { Injectable } from '@nestjs/common';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import {User} from "../../users/entities/user.entity";
import {authenticator} from "otplib";
import {ConfigService} from "@nestjs/config";
import {UsersService} from "../../users/users.service";

@Injectable()
export class TwoFactorAuthenticationService {
  constructor (
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: number, secret: string) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode.toString(),
      secret
    });
  }

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpAuthUrl = authenticator.keyuri(user.email, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpAuthUrl
    }
  }

  public async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }
}