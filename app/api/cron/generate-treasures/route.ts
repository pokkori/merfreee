// Vercel Cron Job: 毎日 22:00 UTC（翌日07:00 JST）に実行
import { createClient } from '@supabase/supabase-js';
import { searchEbayItems, usdToJpy } from '@/lib/ebay/search';
import { CATEGORY_EBAY_KEYWORDS, DOMESTIC_PRICE_MOCK, CATEGORY_NAMES_JA } from '@/lib/ebay/categories';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function generateAiComment(
  itemName: string,
  domesticLow: number,
  domesticHigh: number,
  overseasLow: number,
  overseasHigh: number,
  roiPct: number
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return '';

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `以下の商品の仕入れ・出品アドバイスを50字以内で日本語で答えてください。
商品: ${itemName}
国内価格: ${domesticLow}〜${domesticHigh}円
海外価格: ${overseasLow}〜${overseasHigh}円
推定ROI: ${roiPct}%`,
        },
      ],
    });

    const content = message.content[0];
    return content.type === 'text' ? content.text : '';
  } catch {
    return '';
  }
}

// JSTの翌日の日付を取得
function getTomorrowJst(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  jst.setDate(jst.getDate() + 1);
  return jst.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  // Authorization: Bearer {CRON_SECRET} で保護
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json({ error: 'Database not configured' }, { status: 503 });
  }

  const validDate = getTomorrowJst();
  const insertedItems: string[] = [];

  for (const [categoryId, keywords] of Object.entries(CATEGORY_EBAY_KEYWORDS)) {
    const domesticMock = DOMESTIC_PRICE_MOCK[categoryId];
    if (!domesticMock) continue;

    // 最初のキーワードで検索
    const ebayItems = await searchEbayItems({ keywords: keywords[0], limit: 10 });

    if (ebayItems.length === 0) {
      // eBay API未設定時はモックデータで登録
      const overseasLow = Math.round(domesticMock.low * 1.8);
      const overseasHigh = Math.round(domesticMock.high * 3.5);
      const domesticMid = Math.round((domesticMock.low + domesticMock.high) / 2);
      const overseasMid = Math.round((overseasLow + overseasHigh) / 2);
      const roi = Math.round(((overseasMid - domesticMid - domesticMid * 0.15) / domesticMid) * 100);
      const priceDiff = Math.round(((overseasMid - domesticMid) / domesticMid) * 100);
      const itemName = `${CATEGORY_NAMES_JA[categoryId] ?? categoryId} お宝商品`;

      const aiComment = await generateAiComment(
        itemName,
        domesticMock.low,
        domesticMock.high,
        overseasLow,
        overseasHigh,
        roi
      );

      await supabase.from('treasure_items').upsert(
        {
          category: categoryId,
          item_name: itemName,
          domestic_price_low: domesticMock.low,
          domestic_price_high: domesticMock.high,
          overseas_price_low: overseasLow,
          overseas_price_high: overseasHigh,
          price_diff_pct: priceDiff,
          roi_pct: roi,
          recommended_platform: 'ebay',
          search_keywords: domesticMock.search_keywords,
          ebay_keywords: keywords[0],
          ai_comment: aiComment || null,
          risk_level: roi > 200 ? 'medium' : 'low',
          plan_required: categoryId === 'anime_figures' || categoryId === 'game_retro' ? 'free' : 'standard',
          valid_date: validDate,
        },
        { onConflict: 'category,valid_date' }
      );

      insertedItems.push(itemName);
      continue;
    }

    // eBay価格の統計計算
    const prices = ebayItems
      .map((item) => parseFloat(item.price.value))
      .filter((p) => !isNaN(p) && p > 0)
      .sort((a, b) => a - b);

    if (prices.length === 0) continue;

    const overseasLowUsd = prices[0];
    const overseasHighUsd = prices[prices.length - 1];
    const overseasMidUsd = prices[Math.floor(prices.length / 2)];

    const overseasLow = usdToJpy(overseasLowUsd);
    const overseasHigh = usdToJpy(overseasHighUsd);
    const overseasMid = usdToJpy(overseasMidUsd);
    const domesticMid = Math.round((domesticMock.low + domesticMock.high) / 2);

    const roi = Math.round(((overseasMid - domesticMid - domesticMid * 0.15) / domesticMid) * 100);
    const priceDiff = Math.round(((overseasMid - domesticMid) / domesticMid) * 100);

    const itemName = ebayItems[0]?.title
      ? ebayItems[0].title.slice(0, 60)
      : `${CATEGORY_NAMES_JA[categoryId] ?? categoryId}`;

    const aiComment = await generateAiComment(
      itemName,
      domesticMock.low,
      domesticMock.high,
      overseasLow,
      overseasHigh,
      roi
    );

    await supabase.from('treasure_items').upsert(
      {
        category: categoryId,
        item_name: itemName,
        domestic_price_low: domesticMock.low,
        domestic_price_high: domesticMock.high,
        overseas_price_low: Math.max(overseasLow, domesticMock.low),
        overseas_price_high: overseasHigh,
        price_diff_pct: Math.max(priceDiff, 10),
        roi_pct: roi,
        recommended_platform: 'ebay',
        search_keywords: domesticMock.search_keywords,
        ebay_keywords: keywords[0],
        ai_comment: aiComment || null,
        risk_level: roi > 300 ? 'high' : roi > 150 ? 'medium' : 'low',
        plan_required: categoryId === 'anime_figures' || categoryId === 'game_retro' ? 'free' : 'standard',
        valid_date: validDate,
      },
      { onConflict: 'category,valid_date' }
    );

    insertedItems.push(itemName);
  }

  return Response.json({ success: true, items_generated: insertedItems.length, valid_date: validDate });
}
