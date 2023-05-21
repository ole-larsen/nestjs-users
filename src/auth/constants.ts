import defaultConfig from '../config/default';
export const jwtConstants = {
  secret: defaultConfig().server.secret,
};