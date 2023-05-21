import { applyDecorators } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { SuccessResponse } from '../common/dto';

export const ApiSuccessfulOkResponse = (
  status: number,
  description: string,
) => {
  return applyDecorators(
    ApiResponse({
      status: status,
      description: description,
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(SuccessResponse),
          },
        ],
        properties: {
          result: {
            type: 'string',
            example: 'OK',
          },
        },
      },
    }),
  );
};
