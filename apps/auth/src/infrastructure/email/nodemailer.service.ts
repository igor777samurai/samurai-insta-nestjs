import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService {
  private readonly logger = new Logger(NodemailerService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
      throw new Error('SMTP environment variables are not configured');
    }

    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized:
          process.env.SMTP_REJECT_UNAUTHORIZED !== 'false',
      },
    });
  }

  async sendRegistrationEmail(email: string, token: string): Promise<void> {
    const apiUrl = process.env.API_URL;
    const from = process.env.SMTP_FROM;

    if (!apiUrl || !from) {
      throw new Error('API_URL or SMTP_FROM is not configured');
    }

    const verificationUrl =
      `${apiUrl}/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`;

    await this.transporter.sendMail({
      from,
      to: email,
      subject: 'Confirm your email address',
      text: `Welcome! Confirm your email by opening this link: ${verificationUrl}`,
      html: `
        <h2>Welcome!</h2>
        <p>Thank you for registering.</p>
        <p>Please confirm your email address by clicking the link below:</p>
        <p><a href="${verificationUrl}">Confirm email</a></p>
        <p>This link expires in 1 hour.</p>
      `,
    });

    this.logger.log(`Verification email sent to ${email}`);
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Gmail SMTP connection successful');
      return true;
    } catch (error) {
      console.error('Gmail SMTP connection failed:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.PASSWORD_RESET_URL}?token=${encodeURIComponent(token)}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password reset',
      html: `
      <h2>Password reset</h2>
      <p>We received a request to reset your password.</p>
      <p>
        <a href="${resetUrl}">Reset password</a>
      </p>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request a password reset, ignore this email.</p>
    `,
    });
  }
}