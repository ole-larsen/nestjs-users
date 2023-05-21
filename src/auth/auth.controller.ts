import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  UnauthorizedException, UsePipes, ValidationPipe, Query
} from '@nestjs/common';

import {ApiBody, ApiExtraModels, ApiTags} from "@nestjs/swagger";
import {AuthService} from "./auth.service";
import {SignInDto} from "./dto/sign-in.dto";
import {ExceptionResponse, SuccessResponse} from "../common/dto";
import {SignedInDto} from "./dto/signed-in.dto";
import {ApiSuccessfulResponse} from "../decorators/api-successful-response.decorator";
import {ApiExceptionResponse} from "../decorators/api-exception-response.decorator";
import {HttpExceptionMessages} from "./dto/exceptions/http-exception-messages.constants";
import {Public} from "../decorators/api-public.decorator";

import {LocalAuthGuard} from "./guards/local-auth.guard";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {VerifyDto} from "./dto/verify.dto";
import {VerifiedDto} from "./dto/verified.dto";
import {SomethingWentWrongException} from "./dto/exceptions/something-went-wrong.exception.dto";
import {NotVerifiedException} from "./dto/exceptions/not-verified.exception.dto";
import {VerificationCodeNotFoundException} from "./dto/exceptions/verification-code-not-found.exception.dto";
import {UserNotFoundException} from "../users/dto/exceptions/user-not-found.exception";
import {VerifyOtpDto} from "./dto/verify-otp.dto";

import {OtpCodeNotCorrectException} from "./dto/exceptions/otp-code-not-correct.exception.dto";
import {ForgotPasswordDto} from "./dto/forgot-password.dto";
import {DeleteUserResponseDto} from "../users/dto/delete-user-response.dto";
import {ForgotPasswordResponseDto} from "./dto/forgot-password-response.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {TokenExpiredException} from "./dto/exceptions/token-expired.exception.dto";
import {PasswordIsNotMatchException} from "./dto/exceptions/password-is-not-match.exception.dto";

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1'
})
@ApiExtraModels(
  SuccessResponse,
  ExceptionResponse,
  UnauthorizedException,
  SignedInDto,
  VerifyDto,
  VerifiedDto,
  VerificationCodeNotFoundException,
  SomethingWentWrongException,
  NotVerifiedException,
  UserNotFoundException,
  VerifyOtpDto
)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('verify')
  @ApiBody({
    type: VerifyDto,
  })
  @UsePipes(new ValidationPipe())
  @ApiSuccessfulResponse(
    HttpStatus.OK,
    HttpExceptionMessages.VERIFIED,
    VerifiedDto,
  )
  @ApiExceptionResponse(
    HttpStatus.UNAUTHORIZED,
    HttpExceptionMessages.VERIFICATION_CODE_NOT_FOUND,
    VerificationCodeNotFoundException,
  )
  @ApiExceptionResponse(
    HttpStatus.NOT_FOUND,
    HttpExceptionMessages.USER_NOT_FOUND,
    UserNotFoundException,
  )
  @ApiExceptionResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    HttpExceptionMessages.SOMETHING_WENT_WRONG,
    SomethingWentWrongException,
  )
  @ApiExceptionResponse(
    HttpStatus.UNAUTHORIZED,
    HttpExceptionMessages.NOT_VERIFIED,
    NotVerifiedException,
  )
  @Public()
  verify(@Body() verifyDto: VerifyDto): Promise<VerifiedDto> {
    return this.authService.verify(verifyDto.code);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({
    type: SignedInDto,
  })
  @UsePipes(new ValidationPipe())
  @ApiSuccessfulResponse(
    HttpStatus.OK,
    HttpExceptionMessages.SIGNED_IN,
    SignedInDto,
  )
  @ApiExceptionResponse(
    HttpStatus.UNAUTHORIZED,
    HttpExceptionMessages.UNAUTHORIZED,
    UnauthorizedException,
  )
  @ApiExceptionResponse(
    HttpStatus.UNAUTHORIZED,
    HttpExceptionMessages.NOT_VERIFIED,
    UnauthorizedException,
  )
  @Public()
  @UseGuards(LocalAuthGuard)
  signIn(@Body() signInDto: SignInDto): Promise<SignedInDto> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('otp')
  @ApiBody({
    type: VerifyOtpDto,
  })
  @UsePipes(new ValidationPipe())
  @ApiSuccessfulResponse(
    HttpStatus.OK,
    HttpExceptionMessages.SUCCESS_VERIFY_OTP,
    ForgotPasswordResponseDto,
  )
  @ApiExceptionResponse(
    HttpStatus.UNAUTHORIZED,
    HttpExceptionMessages.WRONG_OTP_CODE,
    OtpCodeNotCorrectException,
  )
  @ApiExceptionResponse(
    HttpStatus.UNAUTHORIZED,
    HttpExceptionMessages.UNAUTHORIZED,
    UnauthorizedException,
  )
  @ApiExceptionResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    HttpExceptionMessages.SOMETHING_WENT_WRONG,
    SomethingWentWrongException,
  )
  @UseGuards(JwtAuthGuard)
  verifyOTP(@Body() verifyOtpDto: VerifyOtpDto, @Request() req) {
    return this.authService.verifyTwoFactorAuthenticationCode(req.user.email, verifyOtpDto.code, req.user.secret);
  }

  @Post('forgot-password')
  @UsePipes(new ValidationPipe())
  @ApiExceptionResponse(
    HttpStatus.UNAUTHORIZED,
    HttpExceptionMessages.NOT_VERIFIED,
    UnauthorizedException,
  )
  @ApiExceptionResponse(
    HttpStatus.UNAUTHORIZED,
    HttpExceptionMessages.UNAUTHORIZED,
    UnauthorizedException,
  )
  @ApiExceptionResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    HttpExceptionMessages.SOMETHING_WENT_WRONG,
    SomethingWentWrongException,
  )
  @ApiSuccessfulResponse(
    HttpStatus.OK,
    HttpExceptionMessages.SUCCESS_FORGOT_PASSWORD,
    ForgotPasswordResponseDto,
  )
  @Public()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe())
  @ApiExceptionResponse(
    HttpStatus.BAD_REQUEST,
    HttpExceptionMessages.PASSWORD_IS_NOT_MATCH,
    PasswordIsNotMatchException,
  )
  @ApiExceptionResponse(
    HttpStatus.UNAUTHORIZED,
    HttpExceptionMessages.UNAUTHORIZED,
    UnauthorizedException,
  )
  @ApiExceptionResponse(
    HttpStatus.FORBIDDEN,
    HttpExceptionMessages.TOKEN_EXPIRED,
    TokenExpiredException,
  )
  @ApiExceptionResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    HttpExceptionMessages.SOMETHING_WENT_WRONG,
    SomethingWentWrongException,
  )
  @ApiSuccessfulResponse(
    HttpStatus.OK,
    HttpExceptionMessages.SUCCESS_FORGOT_PASSWORD,
    ForgotPasswordResponseDto,
  )
  @Public()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('callback')
  @UsePipes(new ValidationPipe())
  @Public()
  callback(@Request() req, @Query('code') code: string, @Query('state') state: string) {
    return { code, state, originalUrl: req.originalUrl };
  }

}
