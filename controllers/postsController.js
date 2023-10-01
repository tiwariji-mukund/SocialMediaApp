const Post = require('../models/posts');
const Comment = require('../models/comments');

module.exports.createPost = async (req, res) => {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    post: post,
                },
                message: "Post Created!"
            })
        }
        req.flash('success', `New Post Created!`);
        return res.redirect('back');

    } catch (err) {
        req.flash('error', `Error in Creating Post`);
        return;
    }
}

module.exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // .id means changing Object id into string
        if (post.user == req.user.id) {
            await post.deleteOne();
            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post Deleted",
                })
            }

            req.flash('success', `Post Deleted!`);

            return res.redirect('back');
        }
        return res.redirect('back');
    } catch (err) {
        req.flash('error', err);
        return;
    }
}
