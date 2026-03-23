'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboardIcon, ListOrderedIcon, FileTextIcon, SettingsIcon, CreditCardIcon, LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/dashboard', label: 'ダッシュボード', icon: LayoutDashboardIcon, ariaLabel: 'ダッシュボードトップへ移動' },
  { href: '/transactions', label: '取引一覧', icon: ListOrderedIcon, ariaLabel: '取引一覧へ移動' },
  { href: '/invoices', label: '適格請求書', icon: FileTextIcon, ariaLabel: '適格請求書一覧へ移動' },
  { href: '/settings', label: '連携設定', icon: SettingsIcon, ariaLabel: '外部サービス連携設定へ移動' },
  { href: '/billing', label: 'プラン・請求', icon: CreditCardIcon, ariaLabel: 'プランと請求情報へ移動' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="サイドバーナビゲーション"
      style={{
        width: 220,
        background: 'rgba(3,4,94,0.95)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* ロゴ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', marginBottom: 32 }}>
        <div style={{ width: 28, height: 28, background: '#E85D04', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 15 }}>M</span>
        </div>
        <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>MerFreee</span>
      </div>

      {/* ナビゲーション */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <li key={item.href} style={{ marginBottom: 4 }}>
              <Link
                href={item.href}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 8,
                  minHeight: 44,
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                  background: isActive ? 'rgba(0,180,216,0.2)' : 'transparent',
                  borderLeft: isActive ? '3px solid #00B4D8' : '3px solid transparent',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s',
                }}
              >
                <item.icon aria-hidden="true" style={{ width: 18, height: 18, flexShrink: 0 }} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ログアウト */}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        aria-label="ログアウトする"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          borderRadius: 8,
          minHeight: 44,
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.5)',
          fontSize: 14,
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
        }}
      >
        <LogOutIcon aria-hidden="true" style={{ width: 18, height: 18 }} />
        ログアウト
      </button>
    </nav>
  );
}
