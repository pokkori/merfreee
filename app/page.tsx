import Link from 'next/link';
import { CheckIcon, ClockIcon, FileTextIcon, RefreshCwIcon, ShieldCheckIcon, TrendingUpIcon, ZapIcon, BarChart3Icon, BookOpenIcon, AlertCircleIcon } from 'lucide-react';

const faqItems = [
  {
    question: 'メルカリShops APIはいつ使えますか？',
    answer: 'パートナー申請審査（2〜4週間）後に利用可能です。審査期間中もダッシュボードの全機能をモックデータでお試しいただけます。',
  },
  {
    question: '弥生とfreeeの両方に同期できますか？',
    answer: 'はい。StandardプランおよびProプランでは弥生・freee両方への同期が可能です。',
  },
  {
    question: 'インボイス登録していなくても使えますか？',
    answer: 'はい。インボイス登録の有無に関わらずご利用いただけます。ただし適格請求書の自動生成機能はインボイス登録済みの事業者様向けです。',
  },
  {
    question: '14日間無料トライアル後はどうなりますか？',
    answer: 'トライアル終了後は自動的に課金は開始されません。ご希望のプランを選択して続けてご利用ください。',
  },
  {
    question: '解約はいつでもできますか？',
    answer: 'はい。ダッシュボードのプラン管理画面からいつでも解約できます。解約月末まで引き続きご利用いただけます。',
  },
];

const features = [
  {
    icon: RefreshCwIcon,
    title: '毎日自動同期',
    description: 'メルカリShopsの売上データを毎日0時に自動取得し、弥生・freeeに連携します。',
  },
  {
    icon: FileTextIcon,
    title: '適格請求書自動生成',
    description: 'インボイス制度に対応した適格請求書を自動生成。PDF形式でダウンロード可能。',
  },
  {
    icon: ShieldCheckIcon,
    title: 'AES-256暗号化',
    description: '連携トークンはAES-256-GCM方式で暗号化して保管。セキュリティを最優先。',
  },
  {
    icon: BarChart3Icon,
    title: '月次レポート',
    description: '月次売上サマリーをメールでお届け。節約できた記帳時間も可視化。',
  },
  {
    icon: ZapIcon,
    title: '弥生・freee両対応',
    description: '弥生会計Onlineとfreeeのどちらにも対応。切り替えも自由。',
  },
  {
    icon: TrendingUpIcon,
    title: 'KPIダッシュボード',
    description: '売上・取引件数・同期状況をリアルタイムで確認できるダッシュボード。',
  },
];

const problems = [
  {
    icon: ClockIcon,
    title: '記帳に毎月数時間',
    description: '取引明細を手動でコピーして会計ソフトに入力する作業が毎月発生。',
  },
  {
    icon: AlertCircleIcon,
    title: 'インボイス対応が複雑',
    description: '適格請求書の発行要件・記載事項が多く、ミスのリスクが高い。',
  },
  {
    icon: BookOpenIcon,
    title: '会計知識がない',
    description: '仕訳の科目や消費税の扱いに自信がなく、税理士費用もかかる。',
  },
];

export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ナビゲーション */}
      <header style={{ background: 'rgba(3,4,94,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }} className="sticky top-0 z-50 backdrop-blur-md">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between" aria-label="メインナビゲーション">
          <div className="flex items-center gap-2">
            <div style={{ width: 32, height: 32, background: '#E85D04', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 18, fontFamily: 'monospace' }}>M</span>
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>MerFreee</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              aria-label="ログインページへ移動"
              style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14, minHeight: 44, display: 'inline-flex', alignItems: 'center', padding: '0 12px' }}
            >
              ログイン
            </Link>
            <Link
              href="/login"
              aria-label="14日間無料トライアルを開始する"
              className="btn-primary"
              style={{ fontSize: 14, padding: '8px 16px' }}
            >
              無料で始める
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* ヒーローセクション */}
        <section className="hero-gradient" style={{ padding: '80px 16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,180,216,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} aria-hidden="true" />
          <div className="max-w-3xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-block', background: 'rgba(0,180,216,0.2)', border: '1px solid rgba(0,180,216,0.4)', borderRadius: 20, padding: '4px 16px', marginBottom: 24 }}>
              <span style={{ color: '#00B4D8', fontSize: 13, fontWeight: 600 }}>メルカリShops API 連携 対応</span>
            </div>
            <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
              メルカリShopsの記帳、<br />全部自動化
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(16px, 2.5vw, 20px)', marginBottom: 8 }}>
              インボイス対応・弥生・freee両対応。月980円から。
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 40 }}>
              毎月の記帳作業をゼロに。売上データは毎日自動で会計ソフトに連携されます。
            </p>
            <div className="flex items-center justify-center gap-4" style={{ flexWrap: 'wrap' }}>
              <Link
                href="/login"
                aria-label="14日間無料トライアルを開始する"
                className="btn-primary"
                style={{ fontSize: 16, padding: '14px 28px', borderRadius: 10 }}
              >
                14日間無料で試す
              </Link>
              <a
                href="#features"
                aria-label="機能詳細を確認する"
                className="btn-secondary"
                style={{ fontSize: 16, padding: '14px 28px', borderRadius: 10 }}
              >
                機能を見る
              </a>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 16 }}>クレジットカード不要・14日間完全無料</p>
          </div>
        </section>

        {/* Beforeセクション（課題） */}
        <section style={{ padding: '80px 16px', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} className="backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ color: 'white', fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, marginBottom: 12 }}>
                毎月の記帳に何時間かかっていますか？
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>
                メルカリShopsで売上が増えるほど、記帳の手間も増えていませんか？
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {problems.map((p, i) => (
                <div key={i} className="glass-card-enhanced backdrop-blur-sm" style={{ padding: 24 }}>
                  <div style={{ width: 48, height: 48, background: 'rgba(239,68,68,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <p.icon aria-hidden="true" style={{ width: 24, height: 24, color: '#EF4444' }} />
                  </div>
                  <h3 style={{ color: 'white', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6 }}>{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 解決策セクション（フロー図） */}
        <section style={{ padding: '80px 16px' }}>
          <div className="max-w-5xl mx-auto">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ color: 'white', fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, marginBottom: 12 }}>
                MerFreeeで全部解決
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>
                3ステップで自動化完了。あとはダッシュボードを確認するだけ。
              </p>
            </div>

            {/* フロー図 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'メルカリShops', sub: '売上データ', color: '#E85D04' },
                { label: 'MerFreee', sub: '自動変換・同期', color: '#00B4D8', isCenter: true },
                { label: '弥生 / freee', sub: '仕訳・取引登録完了', color: '#0A6EBD' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="glass-card-enhanced backdrop-blur-sm" style={{ padding: '20px 24px', textAlign: 'center', minWidth: 140, transform: step.isCenter ? 'scale(1.05)' : undefined, border: step.isCenter ? `2px solid ${step.color}` : undefined }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: step.color, margin: '0 auto 8px', boxShadow: `0 0 12px ${step.color}` }} />
                    <p style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{step.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{step.sub}</p>
                  </div>
                  {i < 2 && (
                    <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <div style={{ width: 40, height: 2, background: 'linear-gradient(to right, #E85D04, #00B4D8)', borderRadius: 1 }} />
                      <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #00B4D8', marginLeft: 8 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 機能セクション */}
        <section id="features" style={{ padding: '80px 16px', background: 'rgba(0,0,0,0.2)' }}>
          <div className="max-w-5xl mx-auto">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ color: 'white', fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, marginBottom: 12 }}>
                主要機能
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {features.map((f, i) => (
                <div key={i} className="glass-card-enhanced backdrop-blur-sm" style={{ padding: 24 }}>
                  <div style={{ width: 48, height: 48, background: 'rgba(0,180,216,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <f.icon aria-hidden="true" style={{ width: 24, height: 24, color: '#00B4D8' }} />
                  </div>
                  <h3 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6 }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 料金プランセクション */}
        <section id="pricing" style={{ padding: '80px 16px', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} className="backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ color: 'white', fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, marginBottom: 12 }}>
                料金プラン
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>14日間無料トライアル後、プランをお選びください</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
              {/* Starterプラン */}
              <div className="glass-card-enhanced backdrop-blur-sm" style={{ padding: 28 }}>
                <h3 style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Starter</h3>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ color: 'white', fontSize: 36, fontWeight: 800 }}>980</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>円/月</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {['メルカリShops連携', '月50件まで同期', '弥生 または freee 連携', 'メール通知'].map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                      <CheckIcon aria-hidden="true" style={{ width: 16, height: 16, color: '#10B981', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  aria-label="Starterプランで14日間無料トライアルを開始する"
                  className="btn-secondary"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  無料で試す
                </Link>
              </div>

              {/* Standardプラン（おすすめ） */}
              <div className="glass-card-enhanced backdrop-blur-sm" style={{ padding: 28, border: '2px solid #00B4D8', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#00B4D8', color: 'white', fontSize: 12, fontWeight: 700, padding: '3px 12px', borderRadius: 12 }}>
                  最もご利用多数
                </div>
                <h3 style={{ color: '#00B4D8', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Standard</h3>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ color: 'white', fontSize: 36, fontWeight: 800 }}>1,980</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>円/月</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {['メルカリShops連携', '月500件まで同期', '弥生 + freee 両対応', '適格請求書PDF自動生成', '月次レポートメール'].map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                      <CheckIcon aria-hidden="true" style={{ width: 16, height: 16, color: '#00B4D8', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  aria-label="Standardプランで14日間無料トライアルを開始する"
                  className="btn-primary"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  無料で試す
                </Link>
              </div>

              {/* Proプラン */}
              <div className="glass-card-enhanced backdrop-blur-sm" style={{ padding: 28 }}>
                <h3 style={{ color: '#E85D04', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Pro</h3>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ color: 'white', fontSize: 36, fontWeight: 800 }}>4,980</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>円/月</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {['メルカリShops連携', '無制限同期', '弥生 + freee 両対応', '適格請求書PDF自動生成', '月次レポートメール', '優先サポート', 'APIアクセス'].map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                      <CheckIcon aria-hidden="true" style={{ width: 16, height: 16, color: '#E85D04', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  aria-label="Proプランで14日間無料トライアルを開始する"
                  className="btn-secondary"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  無料で試す
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQセクション */}
        <section id="faq" style={{ padding: '80px 16px', background: 'rgba(0,0,0,0.2)' }}>
          <div className="max-w-3xl mx-auto">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ color: 'white', fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, marginBottom: 12 }}>
                よくある質問
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {faqItems.map((item, i) => (
                <div key={i} className="glass-card-enhanced backdrop-blur-sm" style={{ padding: 24 }}>
                  <h3 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{item.question}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section style={{ padding: '80px 16px', textAlign: 'center' }} className="hero-gradient">
          <div className="max-w-2xl mx-auto">
            <h2 style={{ color: 'white', fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, marginBottom: 16 }}>
              今すぐ記帳を自動化しませんか？
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 32 }}>
              14日間完全無料。クレジットカード不要。いつでも解約できます。
            </p>
            <Link
              href="/login"
              aria-label="14日間無料トライアルを開始する"
              className="btn-primary"
              style={{ fontSize: 18, padding: '16px 36px', borderRadius: 12 }}
            >
              14日間無料で試す
            </Link>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer style={{ background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '32px 16px' }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, background: '#E85D04', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>M</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600 }}>MerFreee</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("メルカリShopsの記帳が全自動に！インボイス対応・弥生・freee両対応のMerFreeeを試してみた #MerFreee #メルカリShops https://merfreee.vercel.app")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MerFreeeをXでシェアする"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 12,
                  textDecoration: 'none',
                  padding: '6px 12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  minHeight: 44,
                }}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" width={13} height={13} fill="rgba(255,255,255,0.7)">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
                Xでシェア
              </a>
              <nav aria-label="フッターナビゲーション" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { href: '/legal/privacy', label: 'プライバシーポリシー' },
                  { href: '/legal/terms', label: '利用規約' },
                  { href: '/legal/tokusho', label: '特定商取引法に基づく表記' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-label={link.label}
                    style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, textDecoration: 'none' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 20, textAlign: 'center' }}>
            (c) 2026 MerFreee. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
