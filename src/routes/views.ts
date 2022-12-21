import express, { Response, NextFunction, Request } from 'express';
import * as UserService from '../services/user.service';
const viewsRouter = express.Router();

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
  res.render('confirmEmailAddress');
});

export default viewsRouter;
