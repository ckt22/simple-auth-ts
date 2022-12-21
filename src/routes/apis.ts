// For simplicity, I am putting all apis here.
// Which should have been put in controllers

import express from 'express';
import { AuthSource, User, UserType } from '../database/entities/user.entity';
import * as userService from '../services/user.service';
import passport from '../passport';

const apisRouter = express.Router();

apisRouter.get('/health', function (req, res, next) {
    res.status(200).send('ok');
});

apisRouter.get('/error', function(req, res, next) {
    throw new Error('always throw');
});

apisRouter.post('/signup/local', async function (req, res, next) {

    const {
        email,
        password,
        'confirm-password': confirmPassword
    } = req.body;

    // validation
    const isValid = await userService.validateSignup(email, password, confirmPassword);
    if (!isValid) {
        console.log('not valid');
        res.render('signup', { err_msg : 'email has been taken' });
    } else {
        await userService.createUser({ 
            email, 
            password, 
            authSource: AuthSource.email,
            userType: UserType.regular, 
            isEmailVerified: false,
            profile: {
                name: email
            }
        });
    
        res.redirect('/email/confirm');
    }
});

apisRouter.post('/signup/facebook');

apisRouter.post('/signup/google', function (req, res, next) {

});

apisRouter.post('/login/local',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function(req, res, next) {
    res.redirect('/profile');
});

apisRouter.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      console.log('log out successfully');
      res.redirect('/');
    });
});

export default apisRouter;