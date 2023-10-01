const nodeMailer = require('../config/nodemailer');

exports.newComment = async (comment) => {
    let htmlString = nodeMailer.renderTemplate({ comment: comment }, '/comments/new_comments.ejs')

    try {
        const info = await nodeMailer.transporter.sendMail({
            from: '"Mukund Jee Tiwari 👻" <mukund.unofficial@gmail.com>', // sender address
            to: "mukundjitiwari@gmail.com", // list of receivers
            subject: "Hello Mukund ✔", // Subject line
            text: "New Comment Added", // plain text body
            html: htmlString, // html body
        });
        // console.log('message sent', info);
        return;
    } catch (error) {
        console.log('error in sending mail', error);
        return;
    }
}