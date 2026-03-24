'use client';

import { useEffect, useRef, useState } from 'react';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: 2400, suffix: '人以上', label: '累計利用者' },
  { value: 185, suffix: '%', label: '平均ROI' },
  { value: 8, suffix: 'カテゴリ', label: '毎日更新' },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return (
    <span style={{ color: '#F59E0B', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800 }}>
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsCounter() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="サービス実績"
      style={{
        padding: '64px 16px',
        background: 'rgba(15,23,42,0.95)',
        borderTop: '1px solid rgba(245,158,11,0.15)',
        borderBottom: '1px solid rgba(245,158,11,0.15)',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <p
          style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 32,
          }}
        >
          実績データ
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32,
          }}
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              style={{
                textAlign: 'center',
                background: 'rgba(15,23,42,0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 16,
                padding: '28px 20px',
              }}
              aria-label={`${stat.label}: ${stat.value}${stat.suffix}`}
            >
              <div style={{ marginBottom: 8 }}>
                {visible ? (
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                ) : (
                  <span style={{ color: '#F59E0B', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800 }}>
                    0{stat.suffix}
                  </span>
                )}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
