import passport from 'passport';
import bcrypt from 'bcrypt';
import { AuthSource, User } from '../database/entities/user.entity';

import passportLocal from 'passport-local';
import passportAuth0 from 'passport-auth0';

const LocalStrategy = passportLocal.Strategy;
const OAuthStrategy = passportAuth0.Strategy;

passport.serializeUser((req, user: any, done) => {
    done(null, user);
  });
  
passport.deserializeUser((user, done) => {
  done(null, user);
});
  
  /**
   * Sign in using Email and Password.
   */
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = await User.findOne({ 
      where: {
        email: email.toLowerCase()
      },
      select: {
        id: true,
        email: true,
        password: true,
        isEmailVerified: true
      },
    });
    console.log('passport user: ', user);
    if (!user) {
      return done(undefined, false, { code: 'email-not-found', message: `Email ${email} not found.` });
    };
    if (!user.isEmailVerified) {
      return done(undefined, false, { code: 'email-not-verified', message: `Email is not verified.`, email });
    };
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        return done(undefined, { id: user.id });
    };
    return done(undefined, false, { message: 'Invalid email or password.' });
  }));
  
  // for facebook and google
  passport.use(new OAuthStrategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  }, async function (accessToken, refreshToken, params, profile, done) {
    // user check
    let existingUser: User, authSource: AuthSource, facebookId, googleId;
    if (profile.provider === 'google-oauth2') {
      authSource = AuthSource.google;
      googleId = profile.id;
      existingUser = await User.findOne({ where: {
        authSource: AuthSource.google,
        google: profile.id
      }});
    } else if (profile.provider === 'facebook') {
      authSource = AuthSource.facebook;
      facebookId = profile.id;
      existingUser = await User.findOne({ where: {
        authSource: AuthSource.facebook,
        facebook: profile.id
      }});
    };
    if (!existingUser) {
      // new user. procced to register.
      const newUser = new User();
      newUser.authSource = authSource;
      newUser.email = profile.user_name || '';
      if (facebookId) {
        newUser.facebook = facebookId;
      }
      if (googleId) {
        newUser.google = googleId;
      }
      newUser.profile = {
        name: profile.displayName,
        email: newUser.email
      }
      await newUser.save();
      existingUser = newUser;
    }
    return done(null, { id: existingUser.id });
  }));

export default passport;