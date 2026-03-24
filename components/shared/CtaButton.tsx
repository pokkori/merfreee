'use client';

import Link from 'next/link';
import { CSSProperties } from 'react';

interface CtaButtonProps {
  href: string;
  label: string;
  children: React.ReactNode;
  fontSize?: number | string;
  minHeight?: number;
  paddingX?: number;
  borderRadius?: number;
  style?: CSSProperties;
}

export function CtaButton({
  href,
  label,
  children,
  fontSize = 16,
  minHeight = 48,
  paddingX = 28,
  borderRadius = 12,
  style,
}: CtaButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      style={{
        background: '#F59E0B',
        color: 'white',
        textDecoration: 'none',
        fontSize,
        fontWeight: 700,
        minHeight,
        display: 'inline-flex',
        alignItems: 'center',
        padding: `0 ${paddingX}px`,
        borderRadius,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'scale(1.05)';
        el.style.boxShadow = '0 0 30px rgba(245,158,11,0.5)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'scale(1)';
        el.style.boxShadow = 'none';
      }}
    >
      {children}
    </Link>
  );
}
