import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {IsBoolean, IsNumber, IsOptional, IsString, MinLength} from "class-validator";

export class CreateEntityDto {
  @ApiProperty({
    example: 1,
    type: Number,
    nullable: false,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'admin',
    type: String,
    nullable: false,
    required: true,
  })
  @Type(() => String)
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'Ole',
    type: String,
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: 'Larsen',
    type: String,
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: '11/06/1983',
    type: String,
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  birthdate: string;

  @ApiProperty({
    example: 'Some information about me',
    type: String,
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  about: string;

  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({
    example: true,
    type: Boolean,
    required: false,
  })
  enabled: boolean;
}
