// For simplicity, I am putting all apis here.
import express from 'express';
import querystring from 'node:querystring';
import { AuthSource, User, UserType } from '../database/entities/user.entity';
import * as userService from '../services/user.service';
import passport, { isAuthenticated } from '../passport';

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

apisRouter.post('/login/local',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function(req, res, next) {
    req.session.loggedInAt = new Date();
    req.session.userId = req.user.id;
    res.redirect('/profile');
});

// an unwilling sacrifice since I am sticking to using ejs. sorry :P
apisRouter.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      console.log('log out successfully');
    });

    if (req.session?.isOAuth) {
        const logoutURL = new URL(
            `https://${process.env.AUTH0_DOMAIN}/v2/logout`
        );
    
        const searchString = querystring.stringify({
            client_id: process.env.AUTH0_CLIENT_ID,
            returnTo: 'http://localhost:3000'
        });
        logoutURL.search = searchString;
    
        res.redirect(logoutURL.toString());
    } else {
        res.redirect('/');
    }
});

// by restful standard, this should be patch. i know. i know.
apisRouter.post('/user/profile', isAuthenticated, async function (req, res, next) {
    const {
        name
    } = req.body;
    await userService.updateUserDetails(req.user.id, name);

    res.redirect('/profile');
});

export default apisRouter;