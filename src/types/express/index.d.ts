import express from 'express';
import { AuthSource } from '../../database/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      oidc?: any
    }
    interface User {
      id?: number,
      email?: string
    }
  }
}

declare module 'express-session' {
  interface SessionData {
      loggedInAt: Date,
      userId: number,
      authSource: AuthSource,
      isOAuth: boolean,
      returnTo: any
  };
}