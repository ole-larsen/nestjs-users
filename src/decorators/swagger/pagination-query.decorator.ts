import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const PaginationQuery = (isRequired = true) => {
  return applyDecorators(
    ApiQuery({
      type: Number,
      name: 'limit',
      example: 50,
      required: isRequired,
    }),
    ApiQuery({
      type: Number,
      name: 'offset',
      example: 1,
      required: isRequired,
    }),
  );
};
