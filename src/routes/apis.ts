// For simplicity, I am putting all apis here.
import express from 'express';
import querystring from 'node:querystring';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { AuthSource, User, UserType } from '../database/entities/user.entity';
import * as userService from '../services/user.service';
import * as emailService from '../services/email.service';
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
        res.render('signup', { err_msg : 'email has been taken' });
    } else {
        const emailVerificationCode = jwt.sign({ email }, process.env.JWT_SECRET);
        await userService.createUser({ 
            email, 
            password, 
            authSource: AuthSource.email,
            userType: UserType.regular, 
            isEmailVerified: false,
            emailVerificationCode,
            profile: {
                name: email,
                email
            }
        });
        await emailService.sendEmail({
            from: process.env.SENDGRID_API_EMAIL_SENDER,
            to: 'tangck0202@gmail.com',
            subject: `Aha Coding Test - Please verify your email.`,
            text: 'some text.',
            html: `<a href=${process.env.APP_HOST}/email/verify?token=${emailVerificationCode}>Click here to verify your email address.</a>`
        });

        res.redirect(`/email/confirm?email=${encodeURIComponent(email)}`);
    }
});

// apisRouter.post('/login/local',
//   passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
//   function(req, res, next) {
//     req.session.loggedInAt = new Date();
//     req.session.userId = req.user.id;
//     res.redirect('/profile');
// });

apisRouter.post('/login/local', async function (req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            if (info.message === 'Email is not verified.') {
                res.redirect(`/email/confirm?email=${encodeURIComponent(info.email)}`);
                return;
            }
            res.render('signin', {
                err_msg: info.message
            });
            return;
        };
        req.session.loggedInAt = new Date();
        req.session.userId = req.user.id;
        res.redirect('/profile');
    })(req, res, next);
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

apisRouter.post('/email/verify', async function (req, res, next) {
    const {
        email
    } = req.body;
    if (!email) {
        throw new Error('email is required');
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    await emailService.sendEmail({
        from: process.env.SENDGRID_API_EMAIL_SENDER,
        to: 'tangck0202@gmail.com',
        subject: `Aha Coding Test - Please verify your email.`,
        text: 'some text.',
        html: `<a href=${process.env.APP_HOST}/email/verify?token=${token}>Click here to verify your email address.</a>`
    });
});

// by restful standard, this should be patch.
apisRouter.post('/user/profile', isAuthenticated, async function (req, res, next) {
    const {
        name
    } = req.body;
    await userService.updateUserDetails(req.user.id, name);
    res.redirect('/profile');
});

export default apisRouter;