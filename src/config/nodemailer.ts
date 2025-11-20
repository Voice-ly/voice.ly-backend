/**
 * Email transporter configuration.
 *
 * Creates and exports a Nodemailer transporter using environment variables.
 * - `MAIL_HOST` and `MAIL_PORT` configure the SMTP server
 * - `EMAIL_USER` and `EMAIL_PASS` provide authentication credentials
 *
 * Keep sensitive values in environment variables and do not commit them.
 */
import nodemailer from "nodemailer";

/**
 * Nodemailer transporter instance configured from environment variables.
 *
 * @constant transporter
 */
export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,       
  port: Number(process.env.MAIL_PORT),                        
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});
