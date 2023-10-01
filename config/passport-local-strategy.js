const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user_models');

// find the user through login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
    async (req, email, password, done) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user || user.password != password) {
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }
            return done(null, user);
        } catch (err) {
            req.flash('error');
            return done(err);
        }
    }
));

// store the user id in the cookies to create a session for that user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// when browser makes a request with that id find the user in the db and print its details
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        return done(null, user);

    } catch (err) {
        req.flash('error');
        return done(err);
    }
});

// check if user is authenticated
passport.checkAuthentication = (req, res, next) => {
    // if user is authenticated
    if (req.isAuthenticated()) return next();
    // if user is not authenticated
    return res.redirect('/');
}

// share the data of authenticated user to views
passport.setAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
};

// if user is authenticated then they will not be able to view sign in or sign up page
passport.isAuthenticate = (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/');
    next();
}

module.exports = passport;