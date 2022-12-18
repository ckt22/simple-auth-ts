import { Response, NextFunction, Request } from "express";
import { OAuthRequest } from "../types";

const router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');

router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req: OAuthRequest, res: Response, next: NextFunction) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

router.get('/signin', function (req: OAuthRequest, res: Response, next: NextFunction) {
    res.render('signin');
});

router.get('/signup', function (req, res, next) {
    res.render('signup');
});

router.post('/verify', function (req: OAuthRequest, res: Response, next: NextFunction) {

});

export default router;
