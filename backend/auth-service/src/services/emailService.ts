import nodemailer, { Transporter } from "nodemailer";

export class EmailService {
    private transporter: Transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false, // true for 465, false for other ports,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
    }


    public async sendOTP(email: string, otp: string, purpose: string): Promise<void> {
        const subject = this.getSubject(purpose);
        const html = this.getOTPEmailTemplate(otp, purpose);

        try {
            await this.transporter.sendMail({
                from: `"ChatFlow" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: subject,
                html: html
            })
        } catch (error) {
            console.error(`❌ Failed to send OTP email to ${email}:`, error);
            throw new Error('Failed to send OTP email');
        }
    }

    private getSubject(purpose: string): string {
        switch (purpose) {
            case 'registration':
                return 'Welcome to ChatFlow - Verify Your Email';
            case 'login':
                return 'ChatFlow - Login Verification Code';
            case 'password-reset':
                return 'ChatFlow - Password Reset Code';
            default:
                return 'ChatFlow - Verification Code';
        }

    }

    private getOTPEmailTemplate(otp: string, purpose: string): string {
        return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>ChatFlow OTP</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .otp { font-size: 32px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>ChatFlow</h1>
            </div>
            <div class="content">
                <h2>Verification Code</h2>
                <p>Your verification code for ${purpose} is:</p>
                <div class="otp">${otp}</div>
                <p>This code will expire in 5 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 ChatFlow. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
    }
}