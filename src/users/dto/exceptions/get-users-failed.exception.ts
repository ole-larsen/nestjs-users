import {ApiProperty} from "@nestjs/swagger";
import {HttpStatus} from "@nestjs/common";
import {Exception} from "../../../common/dto";
import {HttpExceptionMessages} from "./http-exception-messages.constants";

export class GetUsersFailedException implements Exception {
  @ApiProperty({ default: HttpStatus.BAD_REQUEST })
  code: number;

  @ApiProperty({ default: 'HttpException' })
  name: string;

  @ApiProperty({
    default: HttpExceptionMessages.GET_USERS_LIST_FAILED_EXCEPTION_MESSAGE,
  })
  message: string;
}
