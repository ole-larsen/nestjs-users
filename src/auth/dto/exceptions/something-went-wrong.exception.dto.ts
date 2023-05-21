import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import {Exception} from "../../../common/dto";
import {HttpExceptionMessages} from "./http-exception-messages.constants";

export class SomethingWentWrongException implements Exception {
  @ApiProperty({ default: HttpStatus.INTERNAL_SERVER_ERROR })
  code: number;

  @ApiProperty({ default: 'HttpException' })
  name: string;

  @ApiProperty({
    default: HttpExceptionMessages.SOMETHING_WENT_WRONG,
  })
  message: string;
}
