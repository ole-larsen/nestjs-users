import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

import {IsBoolean} from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  enabled?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  verified?: boolean;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsBoolean()
  auth_confirmation_token?: string;
}
