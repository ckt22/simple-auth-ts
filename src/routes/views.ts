import express, { Response, NextFunction, Request } from "express";

const viewsRouter = express.Router();
import { requiresAuth } from "express-openid-connect";

viewsRouter.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs'
  });
});

viewsRouter.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
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
})

export default viewsRouter;
