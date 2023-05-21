import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class ResetPasswordResponseDto {
  constructor(id: number) {
    this.id = id;
  }
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  id: number;
}