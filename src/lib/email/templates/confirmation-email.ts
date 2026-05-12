import { formatDualMoney, formatMoneyEUR } from '@/lib/money'

type OrderItem = {
  productNameSnapshotBg: string
  productNameSnapshotEn: string
  quantity: number
  unitPriceSnapshotCents: number
  lineTotalCents: number
}

type DeliveryInfo = {
  method: 'speedy_locker' | 'speedy_office' | 'address'
  details: Record<string, unknown>
}

type ConfirmationEmailData = {
  language: 'bg' | 'en'
  confirmationToken: string
  publicOrderNumber: string
  customerFirstName: string
  customerLastName: string
  items: OrderItem[]
  subtotalCents: number
  deliveryBaseChargedCents: number
  deliverySurchargeCents: number
  freeDeliveryApplied: boolean
  totalCents: number
  delivery: DeliveryInfo
  appBaseUrl: string
}

function deliveryLabel(data: ConfirmationEmailData): string {
  const { method, details } = data.delivery
  const lang = data.language

  if (method === 'speedy_locker') {
    const name = details.lockerName as string
    const city = details.lockerCity as string
    return lang === 'bg'
      ? `Speedy автомат: ${name}, ${city}`
      : `Speedy locker: ${name}, ${city}`
  }
  if (method === 'speedy_office') {
    const name = details.officeName as string
    const city = details.officeCity as string
    return lang === 'bg'
      ? `Speedy офис: ${name}, ${city}`
      : `Speedy office: ${name}, ${city}`
  }
  // address
  const city = details.city as string
  return lang === 'bg' ? `Доставка до адрес в ${city}` : `Address delivery in ${city}`
}

function deliveryFeeRow(data: ConfirmationEmailData): string {
  const lang = data.language
  const total = data.deliveryBaseChargedCents + data.deliverySurchargeCents
  if (data.freeDeliveryApplied && data.deliverySurchargeCents === 0) {
    const label = lang === 'bg' ? 'Доставка (безплатна)' : 'Delivery (free)'
    return `<tr><td style="padding:4px 0;color:#6b7280;">${label}</td><td style="padding:4px 0;text-align:right;color:#6b7280;">€0.00</td></tr>`
  }
  const label = lang === 'bg' ? 'Доставка' : 'Delivery'
  return `<tr><td style="padding:4px 0;color:#6b7280;">${label}</td><td style="padding:4px 0;text-align:right;">${formatMoneyEUR(total)}</td></tr>`
}

export function buildConfirmationEmail(data: ConfirmationEmailData): { subject: string; html: string } {
  const lang = data.language
  const confirmUrl = `${data.appBaseUrl}/order-confirmation/${data.confirmationToken}`
  const legalBase = data.appBaseUrl

  const subject =
    lang === 'bg'
      ? `Потвърди поръчка ${data.publicOrderNumber} — ТЕПЕ bite`
      : `Confirm your order ${data.publicOrderNumber} — ТЕПЕ bite`

  const itemRows = data.items
    .map((item) => {
      const name = lang === 'bg' ? item.productNameSnapshotBg : item.productNameSnapshotEn
      const qty = item.quantity > 1 ? ` ×${item.quantity}` : ''
      return `<tr>
        <td style="padding:6px 0;color:#374151;">${name}${qty}</td>
        <td style="padding:6px 0;text-align:right;font-weight:600;">${formatMoneyEUR(item.lineTotalCents)}</td>
      </tr>`
    })
    .join('')

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'DM Sans',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fdfcfb;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(50,30,60,0.10);">

      <!-- Header -->
      <tr><td style="background:oklch(32% 0.09 315);background:#3d1a5c;padding:32px 40px;text-align:center;">
        <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:0.04em;">ТЕПЕ bite</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;">
          ${lang === 'bg' ? 'Потвърждение на поръчка' : 'Order confirmation'}
        </div>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 8px;font-size:16px;color:#1a0a2e;">
          ${lang === 'bg' ? `Здравей, ${data.customerFirstName}!` : `Hi ${data.customerFirstName},`}
        </p>
        <p style="margin:0 0 24px;color:#4b5563;font-size:15px;">
          ${lang === 'bg'
            ? `Получихме поръчка <strong>${data.publicOrderNumber}</strong>. За да я потвърдиш, натисни бутона по-долу.`
            : `We received your order <strong>${data.publicOrderNumber}</strong>. Click below to confirm it.`
          }
        </p>

        <!-- Confirm button -->
        <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
          <tr><td style="background:#c9833a;border-radius:12px;">
            <a href="${confirmUrl}" style="display:block;padding:14px 36px;color:#fff;font-weight:700;font-size:16px;text-decoration:none;text-align:center;">
              ${lang === 'bg' ? 'Потвърди поръчката' : 'Confirm order'}
            </a>
          </td></tr>
        </table>

        <p style="margin:0 0 24px;font-size:13px;color:#9ca3af;text-align:center;">
          ${lang === 'bg'
            ? 'Линкът е валиден 24 часа. Ако не си правил поръчка, игнорирай имейла.'
            : 'This link is valid for 24 hours. If you did not place this order, ignore this email.'
          }
        </p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">

        <!-- Order summary -->
        <div style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;margin-bottom:12px;">
          ${lang === 'bg' ? 'Резюме на поръчката' : 'Order summary'}
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
          ${itemRows}
          <tr><td colspan="2" style="border-top:1px solid #e5e7eb;padding-top:8px;"></td></tr>
          <tr><td style="padding:4px 0;color:#6b7280;">${lang === 'bg' ? 'Продукти' : 'Products'}</td>
              <td style="padding:4px 0;text-align:right;">${formatMoneyEUR(data.subtotalCents)}</td></tr>
          ${deliveryFeeRow(data)}
          ${data.freeDeliveryApplied && data.deliverySurchargeCents > 0
            ? `<tr><td style="padding:4px 0;color:#6b7280;font-size:12px;">${lang === 'bg' ? 'Надбавка за тип доставка' : 'Delivery type surcharge'}</td>
               <td style="padding:4px 0;text-align:right;font-size:12px;">${formatMoneyEUR(data.deliverySurchargeCents)}</td></tr>`
            : ''
          }
          <tr>
            <td style="padding:12px 0 4px;font-weight:700;font-size:16px;color:#1a0a2e;">
              ${lang === 'bg' ? 'Общо' : 'Total'}
            </td>
            <td style="padding:12px 0 4px;text-align:right;font-weight:700;font-size:16px;color:#3d1a5c;">
              ${formatDualMoney(data.totalCents)}
            </td>
          </tr>
        </table>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">

        <!-- Delivery & payment -->
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:24px;">
          <tr>
            <td style="padding:4px 12px 4px 0;color:#6b7280;width:140px;">${lang === 'bg' ? 'Доставка' : 'Delivery'}</td>
            <td style="padding:4px 0;color:#374151;">${deliveryLabel(data)}</td>
          </tr>
          <tr>
            <td style="padding:4px 12px 4px 0;color:#6b7280;">${lang === 'bg' ? 'Плащане' : 'Payment'}</td>
            <td style="padding:4px 0;color:#374151;">${lang === 'bg' ? 'Наложен платеж' : 'Cash on delivery'}</td>
          </tr>
          <tr>
            <td style="padding:4px 12px 4px 0;color:#6b7280;">${lang === 'bg' ? 'Фискален бон' : 'Fiscal receipt'}</td>
            <td style="padding:4px 0;color:#374151;">${lang === 'bg' ? 'Издава се от Speedy при доставка' : 'Issued by Speedy upon delivery'}</td>
          </tr>
          <tr>
            <td style="padding:4px 12px 4px 0;color:#6b7280;">${lang === 'bg' ? 'Очакван срок' : 'Expected'}</td>
            <td style="padding:4px 0;color:#374151;">${lang === 'bg' ? '2–4 работни дни след потвърждение' : '2–4 business days after confirmation'}</td>
          </tr>
        </table>

        <!-- Confirmation URL fallback -->
        <div style="background:#f9f7f4;border-radius:10px;padding:16px;margin-bottom:24px;font-size:13px;color:#6b7280;">
          ${lang === 'bg'
            ? 'Ако бутонът не работи, копирай и постави следния адрес в браузъра:'
            : "If the button doesn't work, copy and paste this link in your browser:"
          }<br>
          <a href="${confirmUrl}" style="color:#c9833a;word-break:break-all;">${confirmUrl}</a>
        </div>

        <!-- Support -->
        <p style="font-size:13px;color:#9ca3af;">
          ${lang === 'bg'
            ? 'Въпроси? Пиши ни на <a href="mailto:tepe@mail.bg" style="color:#c9833a;">tepe@mail.bg</a>'
            : 'Questions? Write us at <a href="mailto:tepe@mail.bg" style="color:#c9833a;">tepe@mail.bg</a>'
          }
        </p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f5f0e8;padding:20px 40px;text-align:center;font-size:12px;color:#9ca3af;">
        <a href="${legalBase}/legal/delivery-payment" style="color:#9ca3af;margin:0 8px;">${lang === 'bg' ? 'Доставка и плащане' : 'Delivery & payment'}</a>
        <a href="${legalBase}/legal/returns-complaints" style="color:#9ca3af;margin:0 8px;">${lang === 'bg' ? 'Рекламации' : 'Returns'}</a>
        <a href="${legalBase}/legal/privacy" style="color:#9ca3af;margin:0 8px;">${lang === 'bg' ? 'Поверителност' : 'Privacy'}</a>
        <br><br>
        ${lang === 'bg' ? '© ТЕПЕ bite. Пловдив, България.' : '© ТЕПЕ bite. Plovdiv, Bulgaria.'}
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`

  return { subject, html }
}
