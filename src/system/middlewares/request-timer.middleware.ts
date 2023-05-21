import { Request, Response, NextFunction } from 'express';

export function requestTimerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.locals.timeStart = process.hrtime();
  next();
}
