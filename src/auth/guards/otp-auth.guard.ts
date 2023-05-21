import {
  CanActivate,
  ExecutionContext, HttpException, HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';

import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../../decorators/api-public.decorator";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {HttpExceptionMessages} from "../dto/exceptions/http-exception-messages.constants";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../users/entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class OtpAuthGuard implements CanActivate {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
    @InjectRepository(User)
    protected readonly usersRepository: Repository<User>,
    protected readonly reflector: Reflector
  ) {
    this.httpService = httpService;
    this.configService = configService;
    this.usersRepository = usersRepository;
    this.reflector = reflector;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const provider = this.configService.get<string>('PROVIDER');
      if (!provider) {
        throw new HttpException(
          HttpExceptionMessages.SOMETHING_WENT_WRONG,
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }

      const headers = {
        'Authorization': token.includes("Bearer") ? token : `Bearer ${token}`,
      };

      const { data } = await this.httpService.axiosRef.get(`${provider}/api/v1/validate`, { headers: headers });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const { password, secret, ...user } = await this.usersRepository.findOneBy( { email: data.client_id, deleted: null } );
      request.user = user;
      return true;
    } catch (e) {
      if (e.response && e.response.data.replace('\n', '')) {
        throw new HttpException(
          HttpExceptionMessages.INVALID_ACCESS_TOKEN,
          HttpStatus.BAD_REQUEST
        );
      }
      throw new UnauthorizedException();
    }
  }

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}