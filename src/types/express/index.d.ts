import express from 'express';

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
      loggedInAt: Date
  };
}