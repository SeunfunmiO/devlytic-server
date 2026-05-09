const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendWelcomeMail = async ({ to, name, role }) => {
    const roleLabel = role === 'developer' ? 'Developer' : 'Company';

    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: 'Welcome to Devlytic',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Welcome to Devlytic, ${name}!</h2>
        <p>You've successfully registered as a <strong>${roleLabel}</strong>.</p>
        ${role === 'developer'
                ? `<p>Start building your profile, showcase your skills, and let companies discover you!</p>`
                : `<p>Start posting jobs and let our AI match you with the best developers!</p>`
            }
        <p>Let's build something great together.</p>
        <br/>
        <p>— The Devlytic Team</p>
      </div>
    `,
    });
};

module.exports = { sendWelcomeMail };