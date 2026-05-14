import nodemailer from 'nodemailer'
import { validateEmailConfig } from '@/lib/config/validators/email.config'

export type SendEmailOptions = {
  to: string
  subject: string
  html: string
}

export type SendEmailResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string }

export async function sendEmail(opts: SendEmailOptions): Promise<SendEmailResult> {
  const cfg = validateEmailConfig()
  if (!cfg.valid) {
    return {
      ok: false,
      error: `Email configuration invalid: ${cfg.issues.join(', ')}`,
    }
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!, // Gmail App Password, not account password
    },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  })

  try {
    const fromName  = process.env.SMTP_FROM_NAME
    const fromEmail = process.env.SMTP_FROM_EMAIL!
    const from = fromName ? `"${fromName}" <${fromEmail}>` : fromEmail

    const info = await transporter.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    })

    return { ok: true, messageId: info.messageId ?? '' }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    return { ok: false, error }
  } finally {
    transporter.close()
  }
}
