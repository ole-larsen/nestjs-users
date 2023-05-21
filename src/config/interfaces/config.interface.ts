export interface Config {
  server: ServerConfig;
  swagger: SwaggerConfig;
  database: DatabaseConfig;
  logger: LoggerConfig;
}

export interface ServerConfig {
  port: number;
  secret: string;
}

export interface LoggerConfig {
  name: string;
  type: string;
  mode?: string;
  path?: string;
  level: string;
  serializers: object;
}

export interface SwaggerConfig {
  title: string;
  version: string;
  description: string;
  tags: string[];
}


export interface PostgresConfig {
  client: string;
  connection: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  pool: {
    min: number;
    max: number;
    idleTimeoutMillis: number;
    createTimeoutMillis: number;
    acquireTimeoutMillis: number;
    propagateCreateError: boolean;
  };
  isDebug: boolean;
}

export interface DatabaseConfig {
  postgres: PostgresConfig;
}
