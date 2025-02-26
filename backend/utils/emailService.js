import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } from '../config/env.js';

// Configure nodemailer
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    }
});

export const sendInviteEmail = async (email, name, inviteLink) => {
    const mailOptions = {
        from: FROM_EMAIL,
        to: email,
        subject: 'Invitation to join Hospital Management System as a Doctor',
        html: `
            <h1>Welcome to Hospital Management System</h1>
            <p>Hi ${name},</p>
            <p>You have been invited to join our Hospital Management System as a Doctor.</p>
            <p>Please click the link below to complete your registration:</p>
            <a href="${inviteLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Complete Registration</a>
            <p>This link is valid for 24 hours.</p>
            <p>Best regards,<br>Hospital Management Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send invitation email');
    }
};