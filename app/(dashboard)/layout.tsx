import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main
        style={{ flex: 1, padding: '32px 24px', background: 'rgba(3,4,94,0.6)', minHeight: '100vh', overflowY: 'auto' }}
        id="main-content"
        role="main"
        aria-label="メインコンテンツ"
      >
        {children}
      </main>
    </div>
  );
}
