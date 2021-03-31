var nodemailer = require('nodemailer');

// // in async func
// pdf.end();
// const stream = pdf;
// const attachments = [{ filename: 'fromFile.pdf', path: './output.pdf', 
// contentType: 'application/pdf' }, { filename: 'fromStream.pdf', content: stream, contentType: 'application/pdf' }];
// await sendMail('"Sender" <sender@test.com>', 'reciver@test.com', 'Test Send Files', '<h1>Hello</h1>', attachments);

const sendMail = ({ message, mailId, body, attachment }) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });
    const attachments = [{ filename: 'invoice.pdf', content: attachment, contentType: 'application/pdf' }];
    var mailOptions = {
        from: 'praveen14568@gmail.com',
        to: mailId,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        attachments
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendMail
}