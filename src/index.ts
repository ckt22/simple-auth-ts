import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import logger from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import session from 'express-session';
import router from './routes/index';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { AppDataSource } from './database';
import { TypeormStore } from "connect-typeorm";

// middlewares
import loadUserMiddleware from './middlewares/loadUserHandler';
import requestErrorHandler from './middlewares/requestErrorHandler';

// passport
import passport from './passport';
import { Session } from './database/entities/session.entity';

const app = express();
app.use(json());
app.use(urlencoded({ extended: true })); // required for posting data with ejs
app.use(cookieParser());
app.use(cors());

AppDataSource.initialize().then(() => console.log('database connected successfully')).catch((error) => console.log(error));

app.use(
  session({
    secret: 'secret',
    name: 'sessionToken',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000000000 },
    store: new TypeormStore({
      ttl: 86400
    }).connect(AppDataSource.getRepository(Session))
  }),
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 3000;

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
    console.log(`Listening on ${port}`);
});
