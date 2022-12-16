import { Response, NextFunction } from "express";
import { OAuthRequest } from "../@types";

const router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');

router.get('/', function (req: OAuthRequest, res: Response, next: NextFunction) {
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

router.post('/verify', function (req: OAuthRequest, res: Response, next: NextFunction) {

});

export default router;
