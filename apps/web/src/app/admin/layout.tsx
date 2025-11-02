import { checkAdminAccess } from '@/lib/admin-auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check admin access on server side
  await checkAdminAccess()

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container-custom py-8">{children}</div>
      </main>
    </div>
  )
}
