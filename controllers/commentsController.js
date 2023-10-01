const Post = require('../models/posts');
const Comment = require('../models/comments');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.createComment = async (req, res) => {
    try {
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email');
            // commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save((err) => {
                if(err){
                    console.log('error in sending to the queue', err);
                    return;
                }
                console.log('job enqueued', job.id);
                return;
            })

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: 'Post Created'
                })
            }

            req.flash('success', `New Comment Added`);
            return res.redirect('back');
        }

    } catch (error) {
        req.flash('error', `Error in adding your comment!`);
        return;
    }
}

module.exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (comment.user == req.user.id) {
            let postId = await comment.post;
            await Comment.deleteOne({ _id: comment.user._id });

            await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
            req.flash('success', 'Comment Deleted!');
            return res.redirect('back');
        }
        return res.redirect('back');
    } catch (err) {
        req.flash('error', `Error in Deleting Comment!`);
        return;
    }
}