import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    Logger.log(`Method: ${req.method}`, 'Request');
    Logger.log(`Path:   ${req.path}`, 'Request');
    Logger.log(`Body:   ${JSON.stringify(req.body)}`, 'Request');
    next();
  }
}
