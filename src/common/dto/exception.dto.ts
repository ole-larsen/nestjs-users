import { ApiProperty } from '@nestjs/swagger';

export abstract class Exception {
  @ApiProperty()
  code: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;
}
