import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { validateEmailConfig } from '@/lib/config/validators/email.config'

let _transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (_transporter) return _transporter

  const cfg = validateEmailConfig()
  if (!cfg.valid) {
    throw new Error(
      `Email configuration invalid:\n${cfg.issues.map((i) => `  • ${i}`).join('\n')}`,
    )
  }

  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
  })

  return _transporter
}

export type SendEmailOptions = {
  to: string
  subject: string
  html: string
}

export type SendEmailResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string }

export async function sendEmail(opts: SendEmailOptions): Promise<SendEmailResult> {
  try {
    const transporter = getTransporter()
    const from = process.env.SMTP_FROM_NAME
      ? `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`
      : process.env.SMTP_FROM_EMAIL!

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
  }
}
