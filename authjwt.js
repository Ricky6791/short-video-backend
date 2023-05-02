import passport from 'passport';
import passportJWT from 'passport-jwt';
import dotenv from 'dotenv';
import User from './Users.js';

dotenv.config();

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.UNIQUE_KEY
};

const strategy = new Strategy(options, (jwtpayload, done) => {
    User.findone({id: jwtpayload.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user)
        } else {
            return done(null, false);
        }
    }
    )
})

passport.use(strategy);

export default passport.authenticate('jwt', {session: false});