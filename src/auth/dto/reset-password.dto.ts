import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, MinLength} from "class-validator";
import {Trim} from "class-sanitizer";

export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  token: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  password: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  repeat: string;
}