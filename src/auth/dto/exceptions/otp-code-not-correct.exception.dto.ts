import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import {Exception} from "../../../common/dto";
import {HttpExceptionMessages} from "./http-exception-messages.constants";

export class OtpCodeNotCorrectException implements Exception {
  @ApiProperty({ default: HttpStatus.UNAUTHORIZED })
  code: number;

  @ApiProperty({ default: 'HttpException' })
  name: string;

  @ApiProperty({
    default: HttpExceptionMessages.WRONG_OTP_CODE,
  })
  message: string;
}
