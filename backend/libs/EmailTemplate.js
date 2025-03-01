export const Verification_email_template = `<!DOCTYPE html>
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
</html>`


export const Welcome_email_template =`<!DOCTYPE html>
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
</html>

`

