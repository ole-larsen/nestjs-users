import { applyDecorators } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

export const ApiParamId = (isRequired = true) => {
  return applyDecorators(
    ApiParam({
      type: Number,
      name: 'id',
      required: isRequired,
    }),
  );
};
