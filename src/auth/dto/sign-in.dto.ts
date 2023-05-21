import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, MinLength} from "class-validator";
import {Trim} from "class-sanitizer";

export class SignInDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsEmail({}, { message: "email is not valid" })
  email: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Trim()
  @IsString()
  @MinLength(5, { message: "password should be minimum of 5 characters" })
  password: string;
}