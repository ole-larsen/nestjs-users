import { ApiProperty } from '@nestjs/swagger';

export class DeleteEntityResponseDto {
  constructor(id: number) {
    this.id = id;
  }

  @ApiProperty({
    type: Number,
    required: true,
  })
  id: number;
}