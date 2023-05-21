import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import {Exception} from "../../../common/dto";
import {HttpExceptionMessages} from "./http-exception-messages.constants";

export class UnauthorizedException implements Exception {
  @ApiProperty({ default: HttpStatus.UNAUTHORIZED })
  code: number;

  @ApiProperty({ default: 'HttpException' })
  name: string;

  @ApiProperty({
    default: HttpExceptionMessages.UNAUTHORIZED,
  })
  message: string;
}
