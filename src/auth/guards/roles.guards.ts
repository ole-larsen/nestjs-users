import {
  CanActivate,
  ExecutionContext,
  HttpException, HttpStatus,
  Injectable,
  SetMetadata,
  UnauthorizedException
} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "../../roles/decorators/roles.decorator";
import {Role} from "../../roles/entities/role.entity";
import {Request} from "express";
import {jwtConstants} from "../constants";
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../../users/users.service";
import {RolesService} from "../../roles/roles.service";
import {SystemRole} from "../../roles/roles.enum";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../users/entities/user.entity";
import {Repository} from "typeorm";
import {ConfigService} from "@nestjs/config";
import {HttpService} from "@nestjs/axios";
import {OtpAuthGuard} from "./otp-auth.guard";
import {IS_PUBLIC_KEY} from "../../decorators/api-public.decorator";
import {HttpExceptionMessages} from "../dto/exceptions/http-exception-messages.constants";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    protected readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    protected readonly rolesRepository: Repository<Role>,
    protected readonly configService: ConfigService,
    protected readonly httpService: HttpService,
    protected readonly reflector: Reflector
  ) {

    this.usersRepository = usersRepository;
    this.rolesRepository = rolesRepository;
    this.configService = configService;
    this.httpService = httpService;
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

      const { password, secret, ...user } = await this.usersRepository.findOne( {
        where: {
          email: data.client_id,
          deleted: null
        },
        relations: ['roles']
      });
      request.user = user;
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        return true;
      }
      console.log(user);

      const roles = user.roles.map((role) => role.title);

      // if (roles.includes('superadmin')) {
      //   return true;
      // }

      return requiredRoles.some((role: string) => roles.includes(role));

    } catch (e) {
      if (e.response && e.response.data.replace('\n', '')) {
        throw new HttpException(
          HttpExceptionMessages.INVALID_ACCESS_TOKEN,
          HttpStatus.BAD_REQUEST
        );
      }
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}