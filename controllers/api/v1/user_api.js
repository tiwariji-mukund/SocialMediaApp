const User = require('../../../models/user_models');
const jwt = require('jsonwebtoken');


// get the data to create session after log in
module.exports.create_session = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user || user.password != req.body.password) {
            return res.json(422, {
                message: "Invalid Username/Password"
            })
        }
        return res.json(200, {
            message: "Signin Successfull",
            data: {
                token: jwt.sign(user.toJSON(), 'codeial', { expiresIn: 1000000 })
            }
        })
    } catch (err) {
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}