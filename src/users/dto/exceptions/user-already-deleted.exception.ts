import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { Exception } from "../../../common/dto";
import { HttpExceptionMessages } from "./http-exception-messages.constants";

export class UserAlreadyDeletedException implements Exception {
  @ApiProperty({ default: HttpStatus.CONFLICT })
  code: number;

  @ApiProperty({ default: 'HttpException' })
  name: string;

  @ApiProperty({
    default: HttpExceptionMessages.USER_ALREADY_DELETED_EXCEPTION_MESSAGE,
  })
  message: string;
}
