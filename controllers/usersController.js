const User = require('../models/user_models');
const fs = require('fs');
const path = require('path');

// get the data of profile page
module.exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        return res.render('profile', {
            title: user.name,
            profile_user: user
        });
    } catch (err) {
        req.flash('error', 'error in fetching the friend list from db');
        return;
    }
}

// profile update controller
module.exports.update_profile = async (req, res) => {

    if (req.params.id == req.user.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, (err) => {
                if (err) { req.flash('error'); return; }

                user.name = req.body.name;
                user.email = req.body.email;
                if (req.file) {
                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();

                req.flash('success', 'Profile Updated!');
                return res.redirect('back');
            })

        } catch (error) {
            req.flash('error');
            return res.redirect('back');
        }

    }
    else {
        req.flash('error', 'User Not Found');
        return res.status(404).send('Unauthorized user');
    }
}

// load data for sign-up page
module.exports.signUp = (req, res) => {
    return res.redirect('/');
}

// load the data for sign-in page
module.exports.signIn = (req, res) => {
    return res.redirect('/');
}

// get the data to create an account
module.exports.create_user = async (req, res) => {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Password did not match');
        return res.redirect('/');
    }
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        if (!user) {
            await User.create(req.body);
            req.flash('success', 'new user created');
            return res.redirect('/');
        }
        else {
            req.flash('error', 'Email is already in use');
            return res.redirect('/');
        }
    }
    catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}

// get the data to create session after log in
module.exports.create_session = (req, res) => {
    req.flash('success', 'welcome to your profile');
    return res.redirect('/');
}

module.exports.destroy_session = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'log out of the account');
        return res.redirect('/');
    });
}