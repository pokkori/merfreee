import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { slackWebhookUrl } = await req.json();

    if (!slackWebhookUrl || typeof slackWebhookUrl !== 'string') {
      return NextResponse.json({ error: 'slackWebhookUrl is required' }, { status: 400 });
    }

    // Slack Webhook URL の形式チェック
    if (!slackWebhookUrl.startsWith('https://hooks.slack.com/services/')) {
      return NextResponse.json({ error: 'Invalid Slack Webhook URL format' }, { status: 400 });
    }

    // Slack へダミー通知を送信
    const slackRes = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: '[越境アービトラージ] テスト通知: Slack連携が正常に設定されています。アラート機能が有効です。',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*[越境アービトラージ] テスト通知*\nSlack連携が正常に設定されています。条件に一致するお宝商品が見つかり次第、こちらに通知が届きます。',
            },
          },
        ],
      }),
    });

    if (!slackRes.ok) {
      const errorText = await slackRes.text();
      return NextResponse.json(
        { error: `Slack returned ${slackRes.status}: ${errorText}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/alerts/test] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
