import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  constructor(id: number) {
    this.id = id;
  }

  @ApiProperty({
    type: Number,
    required: true,
  })
  id: number;
}