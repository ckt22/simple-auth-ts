import express, { Response, NextFunction } from 'express';
import { OAuthRequest, ResponseError } from './types';
import 'dotenv/config';
import http from 'http';
import logger from 'morgan';
import path from 'path';
import { json, urlencoded } from 'body-parser';
import session from 'express-session';
import router from './routes/index';
// import { auth } from 'express-openid-connect'; // bye :/
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { AppDataSource } from './database';
import { AuthSource, User } from './database/entities/user.entity';

// middlewares
import loadUserMiddleware from './middlewares/loadUserHandler';
import requestErrorHandler from './middlewares/requestErrorHandler';

// passport
import passport from './passport';

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000000000 },
  }),
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000000000 },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

AppDataSource.initialize().then(() => console.log('database connected successfully')).catch((error) => console.log(error));

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: ''
};

const port = process.env.PORT || 3000;
if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}

// I thought i could use auth0 widget directly but it seems that it's a trap haha
// app.use(auth(config));

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
