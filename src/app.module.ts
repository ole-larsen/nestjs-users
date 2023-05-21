import {Logger, MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/default';
import * as Joi from 'joi';
import { validate } from './config/validator/env.validation';
import {ApiConfigService} from "./config/services/api.config.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {getTypeOrmConfig} from "./config/services/typeorm.config";
import {CacheInterceptor, CacheModule} from '@nestjs/cache-manager';
import {APP_GUARD, APP_INTERCEPTOR} from "@nestjs/core";
import {ScheduleModule} from "@nestjs/schedule";
import { WinstonModule } from 'nest-winston';

import {RequestLoggerMiddleware} from "./system/middlewares/request-logger.middleware";
import {PrometheusMetricsModule} from "./system/modules/prometheus-metrics.module";
import {SystemModule} from "./system/system.module";
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import {DataSource} from "typeorm";
import { AuthModule } from './auth/auth.module';
import {RolesGuard} from "./auth/guards/roles.guards";
import {UsersService} from "./users/users.service";
import {User} from "./users/entities/user.entity";
import {Role} from "./roles/entities/role.entity";
import {RolesService} from "./roles/roles.service";
import {databaseProviders} from "./system/providers/database.provider";

import { HealthModule } from './health/health.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AddressesModule } from './addresses/addresses.module';
import {JwtAuthGuard} from "./auth/guards/jwt-auth.guard";
import {MailerModule} from "@nestjs-modules/mailer";
import {PugAdapter} from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import {AuthService} from "./auth/auth.service";
import {TwoFactorAuthenticationService} from "./auth/services/two-factor-authentication.service";

@Module({
  imports: [
    PrometheusMetricsModule,
    SystemModule,
    WinstonModule.forRoot({
      // options
    }),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([User, Role]),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    ConfigModule.forRoot({
      validate,
      envFilePath: '.env',
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        SERVER_PORT: Joi.number().default(3000),
        LOG_NAME: Joi.string().default('SHEIRA'),
        LOG_TYPE: Joi.string().default('backend'),
        LOG_LEVEL: Joi.string().default('INFO'),
        LOG_MAX_LENGTH: Joi.number().default(1024),
        DB_SQL_CLIENT: Joi.string().default("pg"),
        DB_SQL_HOST: Joi.string().default("dapp-postgres"),
        DB_SQL_PORT: Joi.number().default(5432),
        DB_SQL_USERNAME: Joi.string().default("sheira_rw"),
        DB_SQL_PASSWORD: Joi.string().default("sheira_rw"),
        DB_SQL_DATABASE: Joi.string().default("sheira"),
        DB_SQL_POOL_MIN: Joi.number().default(0),
        DB_SQL_POOL_MAX: Joi.number().default(10),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    RolesModule,
    UsersModule,
    AuthModule,
    HealthModule,
    ProfilesModule,
    AddressesModule,
    MailerModule.forRoot({
      transport: {
        service: "gmail",
        secure: false,
        auth: {
          user: 'your email address',
          pass: 'your email password',
        },
      },
      defaults: {
        from: '"No Reply" <youremail@gmail.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [],
  providers: [
    Logger,
    UsersService,
    RolesService,
    ApiConfigService,
    ...databaseProviders,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  exports: [...databaseProviders]
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    // console.log(dataSource)
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}