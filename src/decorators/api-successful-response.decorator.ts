import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { SuccessResponse } from '../common/dto';

export const ApiSuccessfulResponse = <TModel extends Type<any>>(
  status: number,
  description: string,
  model: TModel,
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
