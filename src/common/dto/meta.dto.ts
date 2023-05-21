import { ApiProperty } from '@nestjs/swagger';

export abstract class Meta {
  @ApiProperty()
  time: number;

  @ApiProperty({ format: 'uuid' })
  requestId: string;
}
