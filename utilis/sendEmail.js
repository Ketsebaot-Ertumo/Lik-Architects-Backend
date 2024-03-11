const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        "user": process.env.USER_1,
        "pass": process.env.PASS_1
    },

});


exports.sendFormWithEmail = async (email, formData) => {
    const mailOptions = {
        from: '"TechEthio Group" <process.env.USER_1>',
        to: email,
        subject: 'Welcome to TechEthio',
        text: `Hello Dear Admin,<br><br>Please find form data below from TechEthio website.<br><br>Form Data:<br>${formData}<br><br>Thanks,<br>TechEthio Group.`,
        html: `<p>Hello Dear,<br><br>Please find form data below from TechEthio website.<br><br>Form Data:<br>${formData}<br><br>Thanks,<br>TechEthio Group.</p>`,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('email sent.', info.response);
        return info; 
    } catch (error) {
        console.error('Error sending email!', error);
        throw error; 
    }
};



exports.sendConfirmationEmail = async (email, confirmationCode, fullName) => {
    const mailOptions = {
        from: '"TechEthio Group" <process.env.USER_1>',
        to: email,
        subject: 'Account Confirmation',
        text: `Hey ${fullName},<br><br>A sign in attempt requires further verification because we did not recognize your device. To complete the sign in, enter the verification code on the unrecognized device.
      <br><br><br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Verification code:<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span style="font-size: 32px;"><b>${confirmationCode}</b></span>.<br><br>Thanks,<br>TechEthio Team`,
        html: `Hey ${fullName},<br><br>A sign in attempt requires further verification because we did not recognize your device. To complete the sign in, enter the verification code on the unrecognized device.
      <br><br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Verification code:<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span style="font-size: 32px;"><b>${confirmationCode}</b></span>.<br><br>Thanks,<br>TechEthio Group.`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('confirmation email sent:', info.response);
        return info; 
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        throw error; 
    } 

};


exports.sendWelcomeEmail = async (email, fullName, userType) => {
    const mailOptions = {
        from: '"TechEthio Group" <process.env.USER_1>',
        to: email,
        subject: 'Welcome to TechEthio',
        text: `Hello ${fullName},\n\nYou’ve just registered and are set to begin as a ${userType}.\n\nThanks,\nTechEthio Team`,
        html: `Welcome to our website ${fullName},<br><br>You have just registered and are set to begin as a ${userType}.<br><br>Thanks,<br>TechEthio Group.`,
    };

    await transporter.sendMail(mailOptions);
};


exports.sendPasswordResetEmail = async (email, resetLink1, resetLink2, fullName) => {
    const mailOptions = {
        from: '"TechEthio Group" <process.env.USER_1>',
        to: email,
        subject: 'Password Reset',
        text: `<p>Hey ${fullName},<br><br>Please click the following link to reset your password:
      <br><br>&emsp;&emsp;&emsp;&emsp;&emsp;Password Reset link:<br>&emsp;&emsp;&emsp;&emsp;&emsp;<span style="font-size: 32px;"><b>${resetLink1}<b></span><br>${resetLink2}.<br><br>Thanks,<br>TechEthio Group.</p>`,
        html: `<p>Hey ${fullName},
      <br><br>&emsp;&emsp;&emsp;&emsp;&emsp;Please click the following link to reset your password.<br><br>&emsp;&emsp;Password Reset link: <br>&emsp;&emsp;
      <span style="font-size: 15px;"><b>${resetLink1}<b></span><br>&emsp;&emsp;<span style="font-size: 15px;"><b>${resetLink2}.
      <br><br>Thanks,<br>TechEthio Group.</p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.response);
        return info; 
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error; 
    }
};


exports.sendConfResetEmail = async (email, fullName) => {
    const mailOptions = {
        from: '"TechEthio Group" <process.env.USER_1>',
        to: email,
        subject: 'Your Account was recovered successfully',
        text: `Welcome back to your account ${fullName},<br><br>If you suspect you were locked out of your account because of changes made by someone else, you should review and protect your account.
      <br><br>Thanks,<br>TechEthio Group.`,
        html: `<p>Welcome back to your account ${fullName},<br><br>If you suspect you were locked out of your account because of changes made by someone else, you should review and protect your account.
      <br><br>Thanks,<br>TechEthio Group.</p>`,
    };

    await transporter.sendMail(mailOptions);
};


exports.shareWithEmail = async (email, pdfBuffer, fileName) => {
    const mailOptions = {
        from: '"TechEthio Group" <process.env.USER_1>',
        to: email,
        subject: 'File attachment',
        text: `Hello Dear,<br><br>Please find the attached file.
      <br><br>Thanks,<br>TechEthio Group.`,
        html: `<p>Hello Dear,<br><br>Please find the attached PDF.
      <br><br>Thanks,<br>TechEthio Group.</p>`,
        attachments: [
            {
                filename: fileName,
                content: pdfBuffer,
            },
        ],
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('email sent with attachment', info.response);
        return info; 
    } catch (error) {
        console.error('Error sending email with attachment', error);
        throw error; 
    }
};

