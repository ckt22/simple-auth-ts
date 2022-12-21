import express, { Response, NextFunction, Request } from 'express';

const viewsRouter = express.Router();

viewsRouter.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs'
  });
});

viewsRouter.get('/profile', function (req, res, next) {
  res.render('profile', {
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
