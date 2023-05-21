import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {IsBoolean, IsNumber, IsOptional, IsString, minLength, MinLength} from "class-validator";

export class CreateEntityDto {
  @ApiProperty({
    example: 1,
    type: Number,
    nullable: false,
    required: true,
  })
  @Type(() => Number)
  userId: number;

  @ApiProperty({
    example: 'main',
    type: String,
    nullable: false,
    required: true,
  })
  @Type(() => String)
  addressType: string;

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
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  house: string;

  @ApiProperty({
    example: 'A',
    type: String,
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  block: string;

  @ApiProperty({
    example: '35',
    type: String,
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  apartments: string;

  @ApiProperty({
    example: 'Some information about this address',
    type: String,
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  additional: string;

  @ApiProperty({
    example: true,
    type: Boolean,
  })
  @Type(() => Boolean)
  enabled: boolean;
}
