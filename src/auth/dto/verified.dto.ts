import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class VerifiedDto {
  constructor(id: number) {
    this.id = id;
  }
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  id: number;
}