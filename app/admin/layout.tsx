// /app/admin/layout.tsx
import AdminProtectedRoute from '@/components/admin-protected-route';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProtectedRoute>{children}</AdminProtectedRoute>;
}
