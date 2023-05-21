import { applyDecorators, Type } from '@nestjs/common';
import { getSchemaPath, ApiResponse } from '@nestjs/swagger';

import { ExceptionResponse } from '../common/dto';

export const ApiExceptionResponse = <TModel extends Type<any>>(
  status: number,
  description: string,
  model?: TModel,
) => {
  return applyDecorators(
    ApiResponse({
      status: status,
      description: description,
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(ExceptionResponse),
          },
        ],
        properties: {
          error: {
            allOf: [
              {
                $ref: getSchemaPath(model),
              },
            ],
          },
        },
      },
    }),
  );
};
