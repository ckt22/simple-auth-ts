import { Response, NextFunction, Request } from 'express';

interface RequestError extends Error {
    status: number;
}

// standardize errors
const requestErrorHandler = (err: RequestError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    if (req.path.includes('api')) {
      res.status(400).json({
        code: 1,
        err: err.name,
        message: err.message
      });
    } else {
      res.render('error', {
        message: err.message,
        error: process.env.NODE_ENV !== 'production' ? err : {}
      });
    }
}
  
export default requestErrorHandler;