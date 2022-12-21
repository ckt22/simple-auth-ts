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