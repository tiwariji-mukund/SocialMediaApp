const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');

queue.process('emails', (job, done) => {
    console.log('emails worker running job', job.data);

    commentsMailer.newComment(job.data);
    done();
})