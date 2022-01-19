const nodemailer = require('nodemailer');

// new Email(user,url).sendWelcome();

/*module.exports = class Email{
    constructor(user,url){
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Dipu Bala <${process.env.EMAIL_FROM}>`
    }

    createTransport(){
        if(process.env.NODE_EN === 'production'){
            //sendGrid
            return 1;
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.Email_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    send(template,subject){
        // 1.define template

        // define email options

        // create a transport and send email
    }
    sendWelcome(){
        this.send('Welcome', 'Welcome to the Book Library');
    }
}*/

const sendEmail = async options => {
    // create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.Email_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    // define email options
    const mailOptions = {
        from: 'Dipu Bala<bala@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    // send the email
    await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;