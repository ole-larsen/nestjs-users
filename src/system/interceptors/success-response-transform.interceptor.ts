import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext, Logger, Inject,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

import { SuccessResponse } from '../../common/dto';
import {WINSTON_MODULE_PROVIDER} from "nest-winston";

@Injectable()
export class SuccessResponseTransformInterceptor<T>
  implements NestInterceptor<T>
{
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
  private readonly REQUEST_ID_HEADER_NAME: string = 'x-request-id';
  private readonly LOGGER_SUCCESSFUL_RESPONSE_POSTFIX: string =
    'SUCCESSFUL_RESPONSE';

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    const response = context.switchToHttp().getResponse();

    // const { log }: { log: Logger } = context.switchToHttp().getRequest();

    //const time = Timer.hrtimeToMs(process.hrtime(response.locals.timeStart));
    const requestId = response.getHeader(this.REQUEST_ID_HEADER_NAME);

    const successfulResponseBody = (data: any): SuccessResponse<T> => ({
      error: null,
      result: data,
      meta: {
        time: null,
        requestId: requestId,
      },
    });

    return next
      .handle()
      .pipe(map((data) => successfulResponseBody(data)))
      .pipe(
        tap((data) => {
            console.log("SuccessResponseTransformInterceptor");
            this.logger.log(JSON.stringify({
              secureJsonData: { ...data },
              postfix: this.LOGGER_SUCCESSFUL_RESPONSE_POSTFIX
            }))
        }
        ),
      );
  }
}
