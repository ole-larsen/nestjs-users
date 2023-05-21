import { Controller, Get } from '@nestjs/common';

import {
  ApiExtraModels,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SuccessResponse, ExceptionResponse } from '../common/dto';

import { Public } from "../decorators/api-public.decorator";

@ApiTags('System')
@Controller('')
@ApiExtraModels(
  SuccessResponse,
  ExceptionResponse,
)
export class SystemController {
  @Get('metrics')
  @Public()
  @ApiResponse({ status: 200, description: 'Prometheus metrics' })
  @ApiProduces('text/plain')
  async metrics(): Promise<string> {
    return 'OK';
  }
}
