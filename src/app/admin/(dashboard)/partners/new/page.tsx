import Link from 'next/link'
import PartnerForm from '@/components/admin/PartnerForm'

export const dynamic = 'force-dynamic'

export default function NewPartnerPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/partners" className="text-sm text-[var(--text-soft)] hover:underline">
          ← Партньори
        </Link>
        <h1 className="mt-1 font-[family-name:var(--font-head)] text-2xl font-bold text-[var(--plum)]">
          Нов партньор
        </h1>
      </div>
      <PartnerForm />
    </div>
  )
}
