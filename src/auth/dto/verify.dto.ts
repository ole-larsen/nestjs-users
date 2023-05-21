import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, MinLength} from "class-validator";
import {Trim} from "class-sanitizer";

export class VerifyDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @Trim()
  @IsString()
  code: string;
}