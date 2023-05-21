import { ApiProperty } from '@nestjs/swagger';

export class CreateEntityResponseDto {
  constructor(id: number) {
    this.id = id;
  }

  @ApiProperty({
    type: Number,
    required: true,
  })
  id: number;
}