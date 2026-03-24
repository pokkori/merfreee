export const CATEGORY_EBAY_KEYWORDS: Record<string, string[]> = {
  anime_figures: ['japanese anime figure vintage', 'dragon ball figure japan', 'gundam model kit japan'],
  vintage_cameras: ['vintage japanese camera nikon', 'minolta film camera japan', 'canon ae-1 japan'],
  game_retro: ['famicom japan retro game', 'super nintendo japan', 'gameboy japan vintage'],
  pottery_crafts: ['japanese pottery handmade', 'vintage sake cup japan', 'japanese ceramic tea bowl'],
  vinyl_records: ['city pop vinyl japan', 'japanese jazz record', 'hosono haruomi record'],
  brand_accessories: ['vintage japanese brand accessory', 'comme des garcons vintage japan'],
  limited_sneakers: ['nike japan limited edition', 'adidas japan exclusive'],
  manga_books: ['vintage manga japan first edition', 'akira manga japan'],
};

// カテゴリ日本語名マッピング
export const CATEGORY_NAMES_JA: Record<string, string> = {
  anime_figures: 'アニメフィギュア',
  vintage_cameras: 'ヴィンテージカメラ',
  game_retro: 'レトロゲーム・機器',
  pottery_crafts: '和食器・工芸品',
  vinyl_records: 'レコード・音楽ソフト',
  brand_accessories: 'ブランドアクセサリー',
  limited_sneakers: '限定スニーカー',
  manga_books: '絶版マンガ・希少本',
};

// カテゴリ別国内相場データ（モック）
export const DOMESTIC_PRICE_MOCK: Record<string, { low: number; high: number; search_keywords: string }> = {
  anime_figures: { low: 3000, high: 15000, search_keywords: 'フィギュア アニメ 初版 レア' },
  vintage_cameras: { low: 5000, high: 30000, search_keywords: 'フィルムカメラ ニコン ミノルタ' },
  game_retro: { low: 2000, high: 20000, search_keywords: 'ファミコン ソフト レトロゲーム' },
  pottery_crafts: { low: 1500, high: 12000, search_keywords: '和食器 陶器 工芸品 骨董' },
  vinyl_records: { low: 1000, high: 8000, search_keywords: 'レコード LP シティポップ' },
  brand_accessories: { low: 3000, high: 25000, search_keywords: 'ブランド アクセサリー ヴィンテージ' },
  limited_sneakers: { low: 8000, high: 40000, search_keywords: '限定 スニーカー ナイキ アディダス' },
  manga_books: { low: 500, high: 5000, search_keywords: '絶版 マンガ 初版 希少' },
};
