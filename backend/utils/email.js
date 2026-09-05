const nodemailer = require("nodemailer");
const logger = require("./logger");

const Verification_email_template = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biethub Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f3e8ff;
            text-align: center;
            padding: 20px;
        }
        .container {
            background: #6a0dad;
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            margin: auto;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            background: white;
            color: #6a0dad;
            display: inline-block;
            padding: 10px;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #ddd;
        }
        a {
            color: #ffccff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Email Verification - Biethub</h2>
        <p>Dear [User's Name],</p>
        <p>Thank you for signing up with <strong>Biethub</strong>! To complete your registration and secure your account, please verify your email address using the OTP below:</p>
        <p class="otp">[XXXXXX]</p>
        <p>This OTP is valid for <strong>30 minutes</strong>. Please do not share it with anyone.</p>
        <p>If you did not request this verification, please ignore this email. For any assistance, feel free to contact our support team at <a href="mailto:support@biethub.com">support@biethub.com</a>.</p>
        <p class="footer">Best regards,<br><strong>The Biethub Team</strong><br><a href="#">Biethub Website</a></p>
    </div>
</body>
</html>`;

const Welcome_email_template = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Biethub</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f3e8ff;
            text-align: center;
            padding: 20px;
        }
        .container {
            background: #6a0dad;
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            margin: auto;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #ddd;
        }
        a {
            color: #ffccff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Welcome to Biethub!</h2>
        <p>Dear [User's Name],</p>
        <p>We are thrilled to have you join <strong>Biethub</strong>! Our platform is designed to provide you with the best experience possible. Get started by exploring your dashboard and setting up your profile.</p>
        <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:support@biethub.com">support@biethub.com</a>.</p>
        <p class="footer">Best regards,<br><strong>The Biethub Team</strong><br><a href="#">Biethub Website</a></p>
    </div>
</body>
</html>`;

const Event_alert_template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BIET Hub Event Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: white;
            color: #4B0082;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 2px solid #4B0082;
            border-radius: 10px;
            box-shadow: 2px 2px 10px rgba(75, 0, 130, 0.2);
        }
        h1, h2 {
            color: #4B0082;
        }
        .highlight {
            font-weight: bold;
        }
        a {
            color: #4B0082;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 BIET Hub Event Alert! 🎉</h1>
        <h2 class="highlight">🔔 Event Name: [Enter Event Name]</h2>
        <p>📅 <strong>Date:</strong> [Enter Date & Time]</p>
        <p>📍 <strong>Location:</strong> [Enter Venue or Online Link]</p>
       
        <h2>📞 Contact for Queries:</h2>
        <p>📧 <strong>Email:</strong> mradulgandhi18@gmail</p>
        <p>📱 <strong>Phone:</strong> 9140395XXX</p>
        <p><strong>Don't miss out on this exciting opportunity! Stay tuned for more updates. 🚀</strong></p>
    </div>
</body>
</html>`;

const pass = process.env.EMPASS;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "energizer1808@gmail.com",
        pass: pass,
    },
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
    if (error) {
        logger.error("Nodemailer SMTP transporter verification failed: %o", error);
    } else {
        logger.info("Nodemailer SMTP transporter verified successfully. Ready to send emails.");
    }
});

const SendVerificationCode = async (email, verificationCode, username) => {
    try {
        const response = await transporter.sendMail({
            from: '"BietHUB 👻" <mradulgandhi18@gmail.com>',
            to: email,
            subject: "Verify Your Email ✔",
            text: "Verify Your Email",
            html: Verification_email_template.replace("[XXXXXX]", verificationCode).replace("[User's Name]", username),
        });
        logger.info(`Verification email sent to: ${email}`);
    } catch (error) {
        logger.error(`Error sending verification email to ${email}: %o`, error);
    }
};

const WelcomeEmail = async (email, username) => {
    try {
        const response = await transporter.sendMail({
            from: '"BietHUB 👻" <mradulgandhi18@gmail.com>',
            to: email,
            subject: "Email Verified Successfully ✔",
            text: "Welcome to BietHub",
            html: Welcome_email_template.replace("[User's Name]", username),
        });
        logger.info(`Welcome email sent to: ${email}`);
    } catch (error) {
        logger.error(`Error sending welcome email to ${email}: %o`, error);
    }
};

const EventAlert = async (email, eventname, date, location) => {
    try {
        const response = await transporter.sendMail({
            from: '"BietHUB 👻" <mradulgandhi18@gmail.com>',
            to: email,
            subject: "Event Alert !!",
            text: "New Event Alert......",
            html: Event_alert_template.replace("[Enter Event Name]", eventname).replace("[Enter Date & Time]", date).replace("[Enter Venue or Online Link]", location),
        });
        logger.info(`Event alert email sent to: ${email}`);
    } catch (error) {
        logger.error(`Error sending event alert email to ${email}: %o`, error);
    }
};

const SendGeneralEmail = async (email, subject, text, html) => {
    try {
        const response = await transporter.sendMail({
            from: '"BietHUB 👻" <mradulgandhi18@gmail.com>',
            to: email,
            subject: subject,
            text: text,
            html: html || `<p>${text}</p>`,
        });
        logger.info(`General email sent to: ${email}`);
        return response;
    } catch (error) {
        logger.error(`Error sending general email to ${email}: %o`, error);
        throw error;
    }
};

module.exports = {
    SendVerificationCode,
    WelcomeEmail,
    EventAlert,
    SendGeneralEmail,
};
