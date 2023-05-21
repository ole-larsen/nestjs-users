import {
  Catch,
  HttpStatus,
  HttpException,
  BadRequestException, Logger,
} from '@nestjs/common';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common/interfaces';

import { ExceptionResponse, Exception } from '../../common/dto';
import { IsArray } from 'class-validator';

const STRING_LIST_SEPARATOR = ', ';

@Catch()
export class ExceptionResponseTransformFilter implements ExceptionFilter {
  private readonly REQUEST_ID_HEADER_NAME: string = 'x-request-id';
  private readonly INTERNAL_SERVER_ERROR_MESSAGE: string =
    'Something went wrong';
  private readonly TELEGRAF_CONTEXT_TYPE = 'telegraf';

  private readonly LOGGER_EXCEPTION_RESPONSE_POSTFIX: string =
    'EXCEPTION_RESPONSE';

  async catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const logger = new Logger();
    //const time = Timer.hrtimeToMs(process.hrtime(response.locals.timeStart));
    const requestId = response.getHeader(this.REQUEST_ID_HEADER_NAME);

    let message: string;
    switch (true) {
      case exception instanceof BadRequestException:
        if (
          exception.response &&
          exception.response.message &&
          IsArray(exception.response.message)
        ) {
          console.log(exception.response)
          message = exception.response.message.join(STRING_LIST_SEPARATOR);

          break;
        }

        message =
          exception.response && exception.response.message
            ? exception.response.message
            : exception.message;

        break;
      case exception instanceof HttpException:
        message = exception.message;

        break;
      default:
        message = this.INTERNAL_SERVER_ERROR_MESSAGE;

        break;
    }

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponseBody: ExceptionResponse<Exception> = {
      error: {
        code: statusCode,
        name: exception.name,
        message: message,
      },
      result: null,
      meta: {
        time: null,
        requestId: requestId,
      },
    };

    logger.log(
      {
        secureJsonData: { ...exceptionResponseBody },
      },
      this.LOGGER_EXCEPTION_RESPONSE_POSTFIX,
    );

    response.status(statusCode).json(exceptionResponseBody);
  }
}
