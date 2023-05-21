import {Exception} from "../../../common/dto";
import {ApiProperty} from "@nestjs/swagger";
import {HttpStatus} from "@nestjs/common";
import {HttpExceptionMessages} from "./http-exception-messages.constants";

export class TokenExpiredException implements Exception {
  @ApiProperty({ default: HttpStatus.FORBIDDEN })
  code: number;

  @ApiProperty({ default: 'HttpException' })
  name: string;

  @ApiProperty({
    default: HttpExceptionMessages.TOKEN_EXPIRED
  })
  message: string;
}
