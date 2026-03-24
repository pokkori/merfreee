'use client';

import { useEffect, useRef, useState } from 'react';

interface RoiAnimationProps {
  targetValue: number;
}

export function RoiAnimation({ targetValue }: RoiAnimationProps) {
  const [current, setCurrent] = useState(0);
  const [scale, setScale] = useState(1.1);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const duration = 500; // ms

  useEffect(() => {
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // easeOut
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * targetValue));
      setScale(1.1 - eased * 0.1);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetValue]);

  return (
    <span
      style={{
        display: 'inline-block',
        transform: `scale(${scale})`,
        transition: 'transform 0.1s',
        color: '#10B981',
        fontWeight: 700,
        fontSize: 16,
      }}
      aria-label={`推定ROI ${targetValue}パーセント`}
    >
      ROI {current}%
    </span>
  );
}
