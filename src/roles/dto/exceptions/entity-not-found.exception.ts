import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { Exception } from "../../../common/dto";
import { HttpExceptionMessages } from "./http-exception-messages.constants";

export class EntityNotFoundException implements Exception {
  @ApiProperty({ default: HttpStatus.NOT_FOUND })
  code: number;

  @ApiProperty({ default: 'HttpException' })
  name: string;

  @ApiProperty({
    default: HttpExceptionMessages.ENTITY_NOT_FOUND_EXCEPTION_MESSAGE,
  })
  message: string;
}
