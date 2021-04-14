const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tourpediaorg@gmail.com',
        pass: 'tourpediadotcomAPROJECTOFSDLABCSEBUET'
    }
});

const sendWelcomeMail = async (email, fullname) => {
    return;
    const mailOptions = {
        from: 'tourpediaorg@gmail.com',
        to: email,
        subject: 'Welcome To TourPedia',
        html: `
            <h1 style="text-align: center;">Welcome To TourPedia!</h1>
            <p style="text-align: center;">Hello, <em>${fullname}</em> Welcome to <strong>TourPedia</strong></p>
            <p style="text-align: center;">Hope you will enjoy our content.</p>
        `
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const sendForgetPasswordMail = async (email, fullname, password) => {
    return;
    const mailOptions = {
        from: 'tourpediaorg@gmail.com',
        to: email,
        subject: 'New Password',
        html: `
            <h1 style="text-align: center;">Check New Password!</h1>
            <p style="text-align: center;">Hello, <em>${fullname}</em> Here is your new password. Please immediately change this password after login into our system.</p>
            <p style="text-align: center;">Password: ${password}</p>
        `
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendWelcomeMail,
    sendForgetPasswordMail,
}

