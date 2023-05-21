import {Exception} from "../../../common/dto";
import {ApiProperty} from "@nestjs/swagger";
import {HttpStatus} from "@nestjs/common";
import {HttpExceptionMessages} from "./http-exception-messages.constants";

export class NotVerifiedException implements Exception {
  @ApiProperty({ default: HttpStatus.UNAUTHORIZED })
  code: number;

  @ApiProperty({ default: 'HttpException' })
  name: string;

  @ApiProperty({
    default: HttpExceptionMessages.NOT_VERIFIED,
  })
  message: string;
}
