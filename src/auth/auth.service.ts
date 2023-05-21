import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../users/entities/user.entity";
import {compare, createRandomToken} from "../users/helpers/hash";
import {ConfigService} from "@nestjs/config";
import configDefault from '../config/default';
import {SignedInDto} from "./dto/signed-in.dto";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";
import {VerifiedDto} from "./dto/verified.dto";
import {UserNotFoundException} from "../users/dto/exceptions/user-not-found.exception";
import {TwoFactorAuthenticationService} from "./services/two-factor-authentication.service";
import {HttpService} from "@nestjs/axios";
import {OtpResponseDto} from "./dto/otp.response.dto";
import {Data, Token} from "client-oauth2";
import ClientOAuth2 = require("client-oauth2");
import {ForgotPasswordResponseDto} from "./dto/forgot-password-response.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {ResetPasswordResponseDto} from "./dto/reset-password-response.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {
    this.twoFactorAuthenticationService = twoFactorAuthenticationService;
    this.configService = configService;
    this.usersService = usersService;
    this.jwtService = jwtService;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    const isMatch = await compare(password, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async verify(code: string): Promise<VerifiedDto> {
    try{
      const user = await this.usersService.findOneByCode(code);
      if (!user) {
        throw new UserNotFoundException();
      }
      const { id } = await this.usersService.verify(user);
      // await this.sendConfirmedEmail(user)
      return new VerifiedDto(id);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async signIn(email: string, password: string): Promise<SignedInDto> {
    try {
      const user = await this.validateUser(email, password);

      if (!user) {
        throw new UnauthorizedException();
      }

      if (!user.verified) {
        throw new HttpException(
          HttpExceptionMessages.NOT_VERIFIED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const payload = {
        id:     user.id,
        email:  user.email,
        secret: user.secret
      };

      if (configDefault().server.secret) {
        const accessToken = await this.jwtService.signAsync(payload, { secret: this.configService.get<string>('SECRET') });

        if (!user.secret) {
          const { secret, otpAuthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user);
          return {
            secret,
            otp_auth_url: otpAuthUrl,
            access_token: accessToken,
          };
        }
        return {
          access_token: accessToken,
        };
      }

      throw new UnauthorizedException();
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async verifyTwoFactorAuthenticationCode(email: string, code: number, secret: string): Promise<OtpResponseDto> {

    const verified = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
      code, secret
    );

    if (!verified) {
      throw new HttpException(
        HttpExceptionMessages.WRONG_OTP_CODE,
        HttpStatus.UNAUTHORIZED
      )
    }

    try {
      const data = await this.oauthAuthenticate(email);

      return new OtpResponseDto(
        data.access_token,
        data.expires_in,
        data.refresh_token,
        data.scope,
        data.token_type
      );

    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async oauthAuthenticate(email: string): Promise<Data> {
    const provider = this.configService.get<string>('PROVIDER');
    if (!provider) {
      throw new HttpException(
        HttpExceptionMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
    const domain = this.configService.get<string>('DOMAIN');
    if (!domain) {
      throw new HttpException(
        HttpExceptionMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
    try {
      const { data } = await this.httpService.axiosRef.get(`${provider}/api/v1/credentials?domain=${domain}&client_id=${email}`);
      const {
        client_id,
        client_secret
      } = data;
      const state = this.configService.get<string>('OAUTH_STATE');
      if (!state) {
        throw new HttpException(
          HttpExceptionMessages.SOMETHING_WENT_WRONG,
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
      const oauth = new ClientOAuth2({
        clientId: client_id,
        clientSecret: client_secret,
        accessTokenUri: `${provider}/api/v1/token`,
        authorizationUri: `${provider}/api/v1/authorize`,
        redirectUri: `//${domain}/api/v1/auth/callback`,
        scopes: ["all"],
        state: state
      });
      const oauthCallback = await this.httpService.axiosRef.get(oauth.code.getUri());

      const token: Token = await oauth.code
        .getToken(oauthCallback.data.result.originalUrl, {
          query: {
            client_id,
            client_secret
          }
        });
      return token.data;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponseDto> {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new UnauthorizedException();
      }

      if (!user.verified) {
        throw new HttpException(
          HttpExceptionMessages.NOT_VERIFIED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      user.password_reset_token = await createRandomToken();
      user.password_reset_expires = Date.now() + 3600000;

      const { id } = await this.usersService.forgotPassword(user);

      const response = new ForgotPasswordResponseDto();
      response.id = id;
      response.password_reset_token = user.password_reset_token;
      response.password_reset_expires = user.password_reset_expires;
      return response;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ResetPasswordResponseDto> {
    try {
      if (resetPasswordDto.password !== resetPasswordDto.repeat) {
        throw new HttpException(
          HttpExceptionMessages.PASSWORD_IS_NOT_MATCH,
          HttpStatus.BAD_REQUEST
        )
      }
      const user = await this.usersService.findOneByToken(resetPasswordDto.token);

      if (!user) {
        throw new UnauthorizedException();
      }

      if (!user.verified) {
        throw new HttpException(
          HttpExceptionMessages.NOT_VERIFIED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const now = new Date();
      if (user.password_reset_expires > +now) {
        throw new HttpException(
          HttpExceptionMessages.TOKEN_EXPIRED,
          HttpStatus.FORBIDDEN
        );
      }
      console.log(user.password_reset_expires, +now)

      return await this.usersService.resetPassword(user);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        HttpExceptionMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}