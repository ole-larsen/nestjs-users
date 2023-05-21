import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsEmail, IsString, MinLength} from "class-validator";
import {Trim} from "class-sanitizer";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {Role} from "../../roles/entities/role.entity";

export class CreateUserDto {
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

  @ApiProperty({
    type: String,
    required: true,
  })
  @Trim()
  @IsString()
  @MinLength(5, { message: "password should be minimum of 5 characters" })
  repeat: string;

  @ApiProperty({
    type: Array,
    required: false,
  })
  roles?: string[];
}
