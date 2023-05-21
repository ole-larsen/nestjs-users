import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";
import {IsNumber, IsOptional, IsString, MinLength} from "class-validator";

export class GetEntityResponseDto {
  @ApiProperty({
    type: Number,
    nullable: true,
    required: true,
  })
  id: number;

  @ApiProperty({
    example: 1,
    type: Number,
    nullable: false,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 'main',
    type: String,
    nullable: false,
    required: true,
  })
  @Type(() => String)
  @IsString()
  @MinLength(3)
  address_type: string;

  @ApiProperty({
    example: 'Russia',
    type: String,
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({
    example: 'St-Petersburg',
    type: String,
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  region: string;

  @ApiProperty({
    example: 'St-Petersburg',
    type: String,
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  district: string;

  @ApiProperty({
    example: 'St-Petersburg',
    type: String,
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({
    example: 195000,
    type: Number,
    nullable: false,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  zip: number;

  @ApiProperty({
    example: 'Nevskiy Prospekt',
    type: String,
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  street: string;

  @ApiProperty({
    example: '10',
    type: String,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  house: string;

  @ApiProperty({
    example: 'A',
    type: String,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  block: string;

  @ApiProperty({
    example: '35',
    type: String,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  apartments: string;

  @ApiProperty({
    example: '35.334323:55.33234234',
    type: String,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  coordinates: string;

  @ApiProperty({
    example: 'Some information about this address',
    type: String,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  additional: string;

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
