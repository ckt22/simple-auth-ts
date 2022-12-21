import { Request } from 'express';

export interface OAuthRequest extends Request {
    oidc: any;
}

export interface ResponseError {
    status?: number;
    message?: string;
}