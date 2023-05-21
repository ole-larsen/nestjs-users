import { ApiProperty } from '@nestjs/swagger';

import { Meta } from './meta.dto';

export abstract class SuccessResponse<T> {
  @ApiProperty({ nullable: true, default: null })
  error: object;

  @ApiProperty()
  result: T;

  @ApiProperty()
  meta: Meta;
}
