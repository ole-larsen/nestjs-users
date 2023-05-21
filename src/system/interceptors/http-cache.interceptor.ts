import {ExecutionContext, Injectable} from "@nestjs/common";
import {CacheInterceptor} from "@nestjs/cache-manager";

@Injectable()
class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return 'key';
  }
}
