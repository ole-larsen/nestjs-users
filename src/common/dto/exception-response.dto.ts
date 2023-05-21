import { ApiProperty } from '@nestjs/swagger';

import { Meta } from './meta.dto';

export abstract class ExceptionResponse<Exception> {
  @ApiProperty()
  error: Exception;

  @ApiProperty({ nullable: true, default: null })
  result: object;

  @ApiProperty()
  meta: Meta;
}
