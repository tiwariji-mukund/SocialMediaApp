const Post = require('../../../models/posts');
const Comment = require('../../../models/comments');

module.exports.index = async (req, res) => {

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
    return res.json(200, {
        message: 'List of Posts',
        posts: myPosts
    })
}

module.exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // .id means changing Object id into string
        if (post.user == req.user.id) {
            await post.deleteOne();
            await Comment.deleteMany({ post: req.params.id });

            return res.json(200, {
                message: 'Post Deleted'
            })
        }
        else {
            return res.json(422, {
                message: 'You cannot delete this post!'
            })
        }
    } catch (err) {
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}
