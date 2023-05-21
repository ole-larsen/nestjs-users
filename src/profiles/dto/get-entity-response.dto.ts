import { ApiProperty } from '@nestjs/swagger';
import {Profile} from "../entities/profile.entity";
import moment from "moment";

export class GetEntityResponseDto {

  @ApiProperty({
    type: Number,
    nullable: true,
    required: true,
  })
  id: number;

  @ApiProperty({
    type: Number,
    nullable: true,
    required: true,
  })
  user_id: number;

  @ApiProperty({
    type: String,
    nullable: true,
    required: true,
  })
  username: string;

  @ApiProperty({
    type: String,
    nullable: true,
    required: true,
  })
  first_name: string;

  @ApiProperty({
    type: String,
    nullable: true,
    required: true,
  })
  last_name: string;

  @ApiProperty({
    type: Date,
    nullable: true,
    required: true,
  })
  birthdate: Date;

  @ApiProperty({
    type: String,
    nullable: true,
    required: true,
  })
  about: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  enabled: boolean;

  @ApiProperty({
    type: Date,
    required: true,
  })
  created: Date;

  @ApiProperty({
    type: Date,
    required: true,
  })
  updated: Date;
}
