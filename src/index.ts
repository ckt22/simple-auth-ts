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
import bcrypt from "bcrypt";
import passport from "passport";
import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

// middlewares
import loadUserMiddleware from './middlewares/loadUserHandler';
import requestErrorHandler from './middlewares/requestErrorHandler';

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
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

// authentication middlewares
passport.serializeUser<any, any>((req, user, done) => {
  done(undefined, user);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findBy({id});
    if (user) {
      done(null, user);
    } else {
      throw new Error('User does not exist');
    }
  } catch (err) {
    done(err, null);
  }
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
  const user = await User.findOne({ 
    where: {
      email: email.toLowerCase()
    }
  });
  if (!user) return done(undefined, false, { message: `Email ${email} not found.` });

  password = bcrypt.hash(password, 10);
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) return done(undefined, user);
  return done(undefined, false, { message: "Invalid email or password." });
}));

/**
 * Sign in with Facebook.
 */
// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_ID,
//   clientSecret: process.env.FACEBOOK_SECRET,
//   callbackURL: "/auth/facebook/callback",
//   profileFields: ["name", "email", "link", "locale", "timezone"],
//   passReqToCallback: true
// }, async (req: any, accessToken, refreshToken, profile, done) => {
//   if (req.user) {
//     const facebookUser = await User.findOne({ where: {
//       facebook: profile.id
//     } });
//     if (facebookUser) {
//       req.flash("errors", { msg: "There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account." });
//       done(null);
//     } else {
//       const user = await User.findOne({
//         where: {
//           id: req.user.id
//         }
//       });
//       if (user) {
//         user.facebook = profile.id;
//         user.token = accessToken;
//         user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
//         user.profile.gender = user.profile.gender || profile._json.gender;
//         await user.save();
//       }
//     }
//   } else {
//       const user = await User.findOne({
//         where: {
//           facebook: profile.id
//         }
//       });
//       if (user) return done(undefined, user);
//       else {
//         const newUser: any = new User();
//         newUser.email = profile._json.email;
//         newUser.facebook = profile.id;
//         newUser.token = accessToken;
//         newUser.authSource = AuthSource.facebook;
//         user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
//         user.profile.gender = profile._json.gender;
//         user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
//         await newUser.save();
//         return done(null, newUser);
//       }
//   }
// }));

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect("/signin");
};

http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on ${config.baseURL}`);
});
