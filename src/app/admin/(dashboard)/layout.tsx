import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth/session'
import AdminShell from '@/components/admin/AdminShell'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect('/admin/login')
  }
  return <AdminShell displayName={admin.displayName}>{children}</AdminShell>
}
