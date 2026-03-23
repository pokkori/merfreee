import { Resend } from 'resend';

export async function sendMonthlyReport(params: {
  userEmail: string;
  userName: string;
  year: number;
  month: number;
  totalSales: number;
  totalTransactions: number;
  savedMinutes: number;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://merfreee.vercel.app';

  await resend.emails.send({
    from: 'MerFreee <noreply@merfreee.jp>',
    to: params.userEmail,
    subject: `【MerFreee】${params.year}年${params.month}月の売上レポート`,
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>月次レポート</title></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #03045E; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 20px;">MerFreee 月次レポート</h1>
    <p style="margin: 4px 0 0; opacity: 0.8;">${params.year}年${params.month}月</p>
  </div>
  <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0;">
    <p>${params.userName ?? params.userEmail} 様</p>
    <p>${params.year}年${params.month}月の売上データを自動連携しました。</p>
    <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #e2e8f0;">
      <h2 style="font-size: 16px; color: #03045E; margin: 0 0 12px;">売上サマリー</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #666;">売上合計</td><td style="text-align: right; font-weight: bold; color: #E85D04;">¥${params.totalSales.toLocaleString()}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">取引件数</td><td style="text-align: right; font-weight: bold;">${params.totalTransactions}件</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">節約した記帳時間</td><td style="text-align: right; font-weight: bold; color: #10B981;">約${params.savedMinutes}分</td></tr>
      </table>
    </div>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${baseUrl}/dashboard" style="background: #E85D04; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">ダッシュボードを開く</a>
    </div>
  </div>
  <div style="text-align: center; padding: 12px; color: #666; font-size: 12px;">
    <p>MerFreee | <a href="${baseUrl}/legal/privacy">プライバシーポリシー</a> | <a href="${baseUrl}/legal/terms">利用規約</a></p>
  </div>
</body>
</html>
    `,
  });
}
