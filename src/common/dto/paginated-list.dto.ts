import { ApiProperty } from '@nestjs/swagger';

export class PaginatedList {
  @ApiProperty({
    type: Number,
    minimum: 1,
    required: true,
  })
  limit: number;

  @ApiProperty({
    type: Number,
    minimum: 1,
    required: true,
  })
  offset: number;

  @ApiProperty({
    type: Number,
    minimum: 1,
    required: true,
  })
  totalCount: number;
}
