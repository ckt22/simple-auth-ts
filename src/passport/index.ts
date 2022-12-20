import passport from "passport";
import bcrypt from "bcrypt";
import { User } from "../database/entities/user.entity";

import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await User.findBy({id});
      if (user) {
        done(null, user);
      } else {
        throw new Error('User does not exist');
      }
    } catch (err) {
      done(err, null);
    }
  });
  
  /**
   * Sign in using Email and Password.
   */
  passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    const user = await User.findOne({ 
      where: {
        email: email.toLowerCase()
      },
      select: {
        id: true,
        email: true,
        password: true
      },
    });
    if (!user) return done(undefined, false, { message: `Email ${email} not found.` });
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        return done(undefined, user);
    };
    return done(undefined, false, { message: "Invalid email or password." });
  }));
  
  /**
   * Sign in with Facebook.
   */
  // passport.use(new FacebookStrategy({
  //   clientID: process.env.FACEBOOK_ID,
  //   clientSecret: process.env.FACEBOOK_SECRET,
  //   callbackURL: "/auth/facebook/callback",
  //   profileFields: ["name", "email", "link", "locale", "timezone"],
  //   passReqToCallback: true
  // }, async (req: any, accessToken, refreshToken, profile, done) => {
  //   if (req.user) {
  //     const facebookUser = await User.findOne({ where: {
  //       facebook: profile.id
  //     } });
  //     if (facebookUser) {
  //       req.flash("errors", { msg: "There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account." });
  //       done(null);
  //     } else {
  //       const user = await User.findOne({
  //         where: {
  //           id: req.user.id
  //         }
  //       });
  //       if (user) {
  //         user.facebook = profile.id;
  //         user.token = accessToken;
  //         user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
  //         user.profile.gender = user.profile.gender || profile._json.gender;
  //         await user.save();
  //       }
  //     }
  //   } else {
  //       const user = await User.findOne({
  //         where: {
  //           facebook: profile.id
  //         }
  //       });
  //       if (user) return done(undefined, user);
  //       else {
  //         const newUser: any = new User();
  //         newUser.email = profile._json.email;
  //         newUser.facebook = profile.id;
  //         newUser.token = accessToken;
  //         newUser.authSource = AuthSource.facebook;
  //         user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
  //         user.profile.gender = profile._json.gender;
  //         user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
  //         await newUser.save();
  //         return done(null, newUser);
  //       }
  //   }
  // }));
  
  /**
   * Login Required middleware.
   */
  export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/signin");
  };

export default passport;