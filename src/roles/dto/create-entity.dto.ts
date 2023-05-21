import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {IsBoolean, IsNumber, IsOptional, IsString, minLength, MinLength} from "class-validator";

export class CreateEntityDto {
  @ApiProperty({
    example: 'admin',
    type: String,
    nullable: false,
    required: true,
  })
  @Type(() => String)
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    example: 'system role',
    type: String,
    nullable: false,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({
    example: true,
    type: Boolean,
    required: false,
  })
  enabled: boolean;
}
