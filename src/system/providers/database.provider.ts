import {DataSource, DataSourceOptions} from 'typeorm';
import {getTypeOrmConfig} from "../../config/services/typeorm.config";
import {DATA_SOURCE} from "./constants.provider";

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource(<DataSourceOptions>getTypeOrmConfig());

      return dataSource.initialize();
    },
  },
];