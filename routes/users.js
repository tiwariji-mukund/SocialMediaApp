const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/usersController');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
// route for update profile page
router.post('/update/:id', passport.checkAuthentication, usersController.update_profile);
router.get('/signup', passport.isAuthenticate, usersController.signUp);
router.get('/signin', passport.isAuthenticate, usersController.signIn);

// routes for forgot password

router.post('/create-user', usersController.create_user);

//use passport as middleware to authenticate
router.post('/create-session', passport.authenticate('local', { failureRedirect: '/' }), usersController.create_session);

router.get('/signout', usersController.destroy_session);

module.exports = router;