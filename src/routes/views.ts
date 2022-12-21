import express from 'express';
import * as UserService from '../services/user.service';
import jwt from 'jsonwebtoken';
const viewsRouter = express.Router();

// middlewares
import isLocalSignup from '../middlewares/isLocalSignupHandler';

viewsRouter.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.isAuthenticated()
  });
});

viewsRouter.get('/profile', async function (req, res, next) {
  const user = await UserService.getUserDetails(req.user.id);
  res.render('profile', {
    title: 'Profile page',
    userProfile: user.profile
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
    res.render('error', {
      message: 'This test case is handled.',
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
    res.render('error', {
      message: 'This test case is handled.',
      error: {}
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { email } =(<{ email: string }>decoded);
  const isVerified = await UserService.verifyEmailAddress(email);
  res.render('emailVerified', {
    result: isVerified
  });
});

viewsRouter.get('/password/reset', isLocalSignup, function (req, res, next) {
  res.render('resetPassword');
});

export default viewsRouter;
