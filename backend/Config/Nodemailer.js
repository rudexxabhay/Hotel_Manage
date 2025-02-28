import nodemailer from 'nodemailer';

const sendOtp = async (email, otp, name) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Grant-Hotel Official",
            text: `Hello ${name}, Your OTP is ${otp}. It is valid for 5 minutes.`
        });

        console.log(` OTP sent successfully to ${email}`);
    } catch (error) {
        console.error(` Error sending OTP to ${email}:`, error.message);
    }
};

export default sendOtp;
