import { Resend } from 'resend'
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

  const resend = new Resend(process.env.RESEND_API_KEY!)

  const fromName = process.env.EMAIL_FROM_NAME
  const fromEmail = process.env.EMAIL_FROM_ADDRESS!
  const from = fromName ? `${fromName} <${fromEmail}>` : fromEmail
  const replyTo = process.env.EMAIL_REPLY_TO || undefined

  const { data, error } = await resend.emails.send({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo,
  })

  if (error) {
    return { ok: false, error: error.message ?? String(error) }
  }

  return { ok: true, messageId: data?.id ?? '' }
}
