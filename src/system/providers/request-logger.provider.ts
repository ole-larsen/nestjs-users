import { REQUEST } from '@nestjs/core';
import { FactoryProvider, Scope } from '@nestjs/common';

export const requestLoggerProvider: FactoryProvider = {
  provide: 'REQUEST_LOGGER',
  scope: Scope.REQUEST,
  useFactory: (req, singletonLogger) => (req.log ? req.log : singletonLogger),
  inject: [REQUEST, 'LOGGER'],
};
