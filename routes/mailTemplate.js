var nodemailer = require('nodemailer');
const fs = require('fs')

// // in async func
// pdf.end();
// const stream = pdf;
// const attachments = [{ filename: 'fromFile.pdf', path: './output.pdf', 
// contentType: 'application/pdf' }, { filename: 'fromStream.pdf', content: stream, contentType: 'application/pdf' }];
// await sendMail('"Sender" <sender@test.com>', 'reciver@test.com', 'Test Send Files', '<h1>Hello</h1>', attachments);

const sendMail = ({ message, mailId, body, attachment, invoiceId, text }) => {
    var transporter = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        secure: true,
        secureConnection: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });
    //Below is for Gmail
    // var transporter = nodemailer.createTransport({
    //     service: 'Gmail',
    //     auth: {
    //         user: process.env.MAIL_USER ,
    //         pass: process.env.MAIL_PASSWORD
    //     }
    // });

    const attachments = [{ filename: `${invoiceId}.pdf`, content: attachment, contentType: 'application/pdf' }];
    var mailOptions = {
        from: 'cc@bibowater.com',
        to: mailId,
        subject: message
    };

    if (invoiceId) {
        mailOptions.attachments = attachments
        mailOptions.text = 'Check your invoice details in the below attachment'
    }
    if (body) mailOptions.html = body

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            try {
                if (invoiceId) {
                    fs.unlink(`${invoiceId}.pdf`, function (err) {
                        if (err) return console.log(err);
                        console.log('file deleted successfully');
                    })
                }
                return true
                //file removed
            } catch (err) {
                console.error(err)
            }
            console.log('Email sent: ' + info.response);
        }
    });
}


module.exports = {
    sendMail
}