import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class VerifyOtpDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  code: number;
}