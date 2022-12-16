import { Response, NextFunction, Request } from 'express';

// Middleware to make the `user` object available for all views
const loadUserHandler = (req: Request, res: Response, next: NextFunction) => {
    res.locals.user = req.oidc.user;
    return next();
};

export default loadUserHandler;