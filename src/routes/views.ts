import express from 'express';
import jwt from 'jsonwebtoken';

const viewsRouter = express.Router();

import * as UserService from '../services/user.service';
import * as SessionService from '../services/session.service';

// middlewares
import isAuthenticated from '../middlewares/isAuthenticatedHandler';
import isLocalSignup from '../middlewares/isLocalSignupHandler';

viewsRouter.get('/', function (req, res, next) {
  res.render('index', {
    isAuthenticated: req.isAuthenticated(),
    isLocalSignup: !req.session?.isOAuth
  });
});

viewsRouter.get('/user/profile', async function (req, res, next) {
  const user = await UserService.getUserDetails(req.session.userId);
  res.render('profile', {
    title: 'Profile page',
    userProfile: {
      ...user.profile,
      authSource: user.authSource,
    }
  });
});

viewsRouter.get('/signin', function (req, res, next) {
  res.render('signin');
});

viewsRouter.get('/signup', function (req, res, next) {
  res.render('signup');
}); 

viewsRouter.get('/email/confirm', function (req, res, next) {
  const { 
    email
  } = req.query;
  if (!email) {
    res.status(400).render('error', {
      message: 'Email not found.',
      error: {}
    });
  }
  res.render('confirmEmailAddress', {
    email
  });
});

viewsRouter.get('/email/verify', async function (req, res, next) {
  const token = req.query.token as string;
  if (!token) {
    res.status(401).render('error', {
      message: 'Token not found.',
      error: {}
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { email } =(<{ email: string }>decoded);
  const isVerified = await UserService.verifyEmailAddress(email);
  const status = isVerified ? 200 : 400;
  res.status(status).render('emailVerified', {
    result: isVerified
  });
});

viewsRouter.get('/password/reset', isLocalSignup, function (req, res, next) {
  res.render('resetPassword');
});

viewsRouter.get('/user/dashboard', isAuthenticated, async function (req, res, next) {
  const usersWithSessionStatistics = await SessionService.getUserSessionStatistics();
  const allUsers = await UserService.getAllUsers();
  const activeSessionsToday = await SessionService.getUsersWithActiveSessionToday();
  const weeklyUserSessions = await SessionService.getUserSessionsInSevenDays();
  res.render('dashboard', {
    ...activeSessionsToday,
    ...weeklyUserSessions,
    registeredUsersCount: allUsers.length,
    users: usersWithSessionStatistics
  });
});

export default viewsRouter;
