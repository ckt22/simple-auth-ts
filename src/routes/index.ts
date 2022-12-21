import express, { Response, NextFunction, Request } from 'express';

const router = express.Router();
import viewsRouter from './views';
import apisRouter from './apis';

import passport from '../passport';

router.use(viewsRouter);
router.use('/api', apisRouter);
router.get("/callback", async (req, res, next) => {
    passport.authenticate("auth0", (err, user, info) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      if (!user) {
        return res.redirect("/signin");
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.session.userId = user.id;
        req.session.loggedInAt = new Date();
        req.session.isOAuth = true;
        res.redirect("/");
      });
    })(req, res, next);
});

router.get('/login/facebook', passport.authenticate("auth0", {
    scope: "openid email profile"
}), function (req, res, next) {
    res.redirect('/');
});

router.get(
    '/login/google', 
    passport.authenticate('auth0', { scope: "openid email profile" }), 
    function (req, res, next) {
        res.redirect('/');
    }
);

export default router;
