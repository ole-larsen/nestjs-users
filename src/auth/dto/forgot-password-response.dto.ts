import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class ForgotPasswordResponseDto {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  password_reset_token: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  password_reset_expires: number;
}