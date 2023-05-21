import {Exception} from "../../../common/dto";
import {ApiProperty} from "@nestjs/swagger";
import {HttpStatus} from "@nestjs/common";
import {HttpExceptionMessages} from "./http-exception-messages.constants";

export class PasswordIsNotMatchException implements Exception {
  @ApiProperty({ default: HttpStatus.BAD_REQUEST })
  code: number;

  @ApiProperty({ default: 'HttpException' })
  name: string;

  @ApiProperty({
    default: HttpExceptionMessages.PASSWORD_IS_NOT_MATCH
  })
  message: string;
}
