import {ApiProperty} from "@nestjs/swagger";

export class ForgotPasswordDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  email: string;
}