import {ApiProperty} from "@nestjs/swagger";
import { IsString } from "class-validator";

export class OtpDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  otpAuthUrl: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  secret: string;
}