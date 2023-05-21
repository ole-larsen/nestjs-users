import {ApiProperty} from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignedInDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  access_token?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  secret?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  otp_auth_url?: string;
}