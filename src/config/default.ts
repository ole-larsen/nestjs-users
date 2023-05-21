import * as dotenv from 'dotenv';

const TRUE_STRING = 'true';

dotenv.config();
export default () => ({
  nodeEnv: process.env.NODE_ENV,
  email: {
    transport: process.env.MAIL_TRANSPORT
  },
  server: {
    port: parseInt(process.env.SERVER_PORT) || 8080,
    secret: process.env.SECRET,
    provider: process.env.PROVIDER,
    domain: process.env.DOMAIN,
    state: process.env.OAUTH_STATE
  },
  swagger: {
    title: 'Sheira API',
    description: 'Identity microservice',
    version: '1.0.0',
  },
  database: {
    postgres: {
      client: process.env.DB_SQL_CLIENT,
      connection: {
        host: process.env.DB_SQL_HOST,
        port: parseInt(process.env.DB_SQL_PORT, 10) || 5432,
        user: process.env.DB_SQL_USERNAME,
        password: process.env.DB_SQL_PASSWORD,
        database: process.env.DB_SQL_DATABASE,
      },
      pool: {
        min: parseInt(process.env.DB_SQL_POOL_MIN, 10) || 0,
        max: parseInt(process.env.DB_SQL_POOL_MAX, 10) || 40,
        idleTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        acquireTimeoutMillis: 30000,
        propagateCreateError: false,
      },
      isDebug: process.env.DB_DEBUG
        ? process.env.DB_DEBUG === TRUE_STRING
        : false,
    },
  },
  logger: {
    name: process.env.LOG_NAME || 'SHEIRA',
    type: process.env.LOG_TYPE || 'backend',
    level: process.env.LOG_LEVEL || 'INFO',
    serializers: {
      err: function (err) {
        return {
          message: JSON.stringify(err.message),
          name: err.name,
          stack: err.stack,
        };
      },
      secureError: function ({ err, params, from }) {
        const messageStr = JSON.stringify(err.message);
        const paramsStr = JSON.stringify(params);

        return {
          error: {
            message: mask(messageStr),
            name: JSON.stringify(err.name),
            stack: JSON.stringify(err.stack),
          },
          from: JSON.stringify(from),
          params: mask(paramsStr),
        };
      },
      stringData: (data) => {
        return JSON.stringify(data);
      },
      secureStringData: (data) => {
        const dataStr = JSON.stringify(data);
        return mask(dataStr);
      },
      jsonData: (data) => {
        return data;
      },
      secureJsonData: (data) => {
        const dataStr = JSON.stringify(data);
        const maskedData = mask(dataStr);

        return JSON.parse(maskedData);
      },
    },
    maxMessageLength: parseInt(process.env.LOG_MAX_LENGTH, 10) || 256,
    isTrim: process.env.LOG_USE_TRIM
      ? process.env.LOG_USE_TRIM.toString() === TRUE_STRING
      : true,
    isMapper: process.env.LOG_USE_MAPPER
      ? process.env.LOG_USE_MAPPER.toString() === TRUE_STRING
      : false,
    isJSON: process.env.LOG_LEVEL_Z
      ? process.env.LOG_LEVEL_Z.toString() === TRUE_STRING
      : true,
  },
  yandex: {
    key: process.env.YANDEX_API_KEY,
    url: process.env.YANDEX_API_BASE_URL
  }
});

const mask = (str): string => {
  const result = str.replace(
    /("password":|"pass":|"token":|"Service-Token":).+?("|,)/,
    '$1"****"',
  );
  return result.replace(/("\d{3,4}")/g, '"***"');
};
