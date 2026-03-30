// /app/admin/layout.tsx
// Admin layout — auth is handled inside /app/admin/page.tsx via useAdmin context
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
