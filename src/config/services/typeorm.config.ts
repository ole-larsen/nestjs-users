import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import config from "../default";

import { Role } from "../../roles/entities/role.entity";
import { User } from "../../users/entities/user.entity";
import {Profile} from "../../profiles/entities/profile.entity";
import {Address} from "../../addresses/entities/address.entity";

function isProduction() {
  return config().nodeEnv === 'production';
}

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: config().database.postgres.connection.host,
    port: config().database.postgres.connection.port,
    username: config().database.postgres.connection.user,
    password: config().database.postgres.connection.password,
    database: config().database.postgres.connection.database,
    // entities: ['/src/**/entities/*.entity{.ts,.js}'],
    entities: [
      Role,
      User,
      Profile,
      Address
    ],
    migrationsTableName: 'migrations',
    migrations: ['migrations/*.ts'],
    ssl: isProduction(),
  };
}

