import { plainToInstance } from 'class-transformer';
import {IsBoolean, IsEnum, IsNumber, IsString, validateSync} from 'class-validator';

enum Environment {
  Development = "development",
  Production = "production",
  Test = "test",
  Provision = "provision",
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  SERVER_PORT: number;

  @IsString()
  LOG_NAME: string;

  @IsString()
  LOG_TYPE: string;

  @IsString()
  LOG_LEVEL: string;

  @IsNumber()
  LOG_MAX_LENGTH: number;

  @IsString()
  DB_SQL_CLIENT: string;

  @IsString()
  DB_SQL_HOST: string;

  @IsNumber()
  DB_SQL_PORT: number;

  @IsString()
  DB_SQL_USERNAME: string;

  @IsString()
  DB_SQL_PASSWORD: string;

  @IsString()
  DB_SQL_DATABASE: string;

  @IsNumber()
  DB_SQL_POOL_MIN: number;

  @IsNumber()
  DB_SQL_POOL_MAX: number;

  @IsBoolean()
  AUTH_ENABLED: boolean;

  @IsString()
  SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}