const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user_models');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial'
}

passport.use(new JWTStrategy(opts, async (jwtPayLoad, done) => {

    try {
        const user = await User.findById(jwtPayLoad._id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (err) {
        console.log(`error ${err}`);
        return done(err);
    }
}));

module.exports = passport;