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
            text: ` Dear [${name}],

Welcome to Grant Hotel! To complete your verification, please use the following One-Time Password (OTP):

🛡️ Your OTP: {${otp}}

This OTP is valid for the next 10 minutes. Please do not share this code with anyone.

If you did not request this verification, please ignore this email or contact our support team immediately.

We look forward to serving you at Grant Hotel!

Best Regards,
Grant Hotel Team
📧 support@granthotel.com | 📞 [+91 9450460987]
            `
        });

        console.log(` OTP sent successfully to ${email}`);
    } catch (error) {
        console.error(` Error sending OTP to ${email}:`, error.message);
    }
};

export default sendOtp;
