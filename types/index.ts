export type Plan = 'trial' | 'free' | 'standard' | 'pro';

export type RiskLevel = 'low' | 'medium' | 'high';

export type RecommendedPlatform = 'ebay' | 'etsy' | 'amazon_us' | 'depop';

export type CategoryId =
  | 'anime_figures'
  | 'vintage_cameras'
  | 'game_retro'
  | 'pottery_crafts'
  | 'vinyl_records'
  | 'brand_accessories'
  | 'limited_sneakers'
  | 'manga_books';

export interface User {
  id: string;
  email: string;
  name: string | null;
  plan: Plan;
  plan_started_at: string | null;
  plan_expires_at: string | null;
  komoju_customer_id: string | null;
  streak_count: number;
  streak_last_date: string | null;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface TreasureItem {
  id: string;
  category: CategoryId;
  item_name: string;
  domestic_price_low: number;
  domestic_price_high: number;
  overseas_price_low: number;
  overseas_price_high: number;
  price_diff_pct: number;
  roi_pct: number;
  recommended_platform: RecommendedPlatform;
  search_keywords: string;
  ebay_keywords: string;
  ai_comment: string | null;
  risk_level: RiskLevel;
  plan_required: Plan;
  valid_date: string;
  created_at: string;
}

export interface Category {
  id: CategoryId;
  name_ja: string;
  name_en: string;
  description: string | null;
  is_active: boolean;
}

export interface SavedItem {
  id: string;
  user_id: string;
  treasure_item_id: string;
  note: string | null;
  created_at: string;
  treasure_item?: TreasureItem;
}

export interface NotificationSettings {
  user_id: string;
  daily_email: boolean;
  email_time: string;
  categories: CategoryId[];
  updated_at: string;
}

export interface DashboardStats {
  today_items_count: number;
  saved_items_count: number;
  avg_roi_pct: number;
  top_category: CategoryId | null;
  streak_count: number;
  total_points: number;
}

export interface EbaySearchResult {
  item_id: string;
  title: string;
  price_usd: number;
  price_jpy: number;
  condition: string;
  sold_count?: number;
  url: string;
}
