import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class OtpResponseDto {
  constructor(accessToken: string, expiresIn: string, refreshToken: string, scope: string, tokenType: string) {
    this.access_token = accessToken;
    this.expires_in = expiresIn;
    this.refresh_token = refreshToken;
    this.scope = scope;
    this.token_type = tokenType;
  }
  @ApiProperty({
    type: String,
  })
  @IsString()
  access_token: string;

  @ApiProperty({
    type: String,
  })
  @IsNumber()
  expires_in: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  refresh_token: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  scope: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  token_type: string;
}