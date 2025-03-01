const {nodemailer} =  require("nodemailer");

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "mradulgandhi18@gmail.com",
        pass: "vtzd lfpt wiwx ywsp",
    },
});

