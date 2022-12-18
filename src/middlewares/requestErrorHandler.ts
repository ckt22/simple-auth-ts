import { Response, NextFunction, Request } from 'express';

interface RequestError extends Error {
    status: number;
}

const requestErrorHandler = (err: RequestError, req: Request, res: Response, next: NextFunction) => {
    
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: process.env.NODE_ENV !== 'production' ? err : {}
    });
}
  
export default requestErrorHandler;