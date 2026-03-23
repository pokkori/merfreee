'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            style={{
              padding: 24,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 12,
              color: '#EF4444',
            }}
          >
            <p style={{ fontWeight: 600, marginBottom: 8 }}>エラーが発生しました</p>
            <p style={{ fontSize: 14, opacity: 0.8 }}>{this.state.error?.message ?? '不明なエラー'}</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
