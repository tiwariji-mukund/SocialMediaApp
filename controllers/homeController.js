const Post = require('../models/posts');
const User = require('../models/user_models');

module.exports.home = async (req, res) => {
    try {
        const myPosts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            })
            .exec();
        const user = await User.find({});
        return res.render('home', {
            title: "Home",
            posts: myPosts,
            all_users: user
        });

    } catch (err) {
        req.flash('error');
        return;
    }
}