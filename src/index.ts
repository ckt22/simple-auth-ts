import express, { Response, NextFunction } from 'express';
import { OAuthRequest, ResponseError } from './@types';
import 'dotenv/config';
import http from 'http';
import logger from 'morgan';
import path from 'path';
import router from './routes/index';
const { auth } = require('express-openid-connect');

// middlewares
import loadUserMiddleware from './middlewares/loadUserHandler';
import requestErrorHandler from './middlewares/requestErrorHandler';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: ''
};

const port = process.env.PORT || 3000;
if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}

app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(loadUserMiddleware);

app.use('/', router);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    res.statusCode = 404;
    next(err);
});

// Error handlers
app.use(requestErrorHandler);

http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on ${config.baseURL}`);
  });
