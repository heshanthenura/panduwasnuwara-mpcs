export interface User {
  id: number;
  username: string;
  full_name: string;
  nic: string;
  phone: string;
  email?: string | null;
  password?: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface GalleryComment {
  id: string;
  post_id: string;
  author: string;
  text: string;
  created_at: string;
}

export interface GalleryPost {
  id: string;
  imageSrc: string;
  aspectRatio: string;
  likesCount: number;
  hasLiked: boolean;
  comments: GalleryComment[];
}

export interface SystemSetting {
  key: string;
  value: string;
  updated_at: string;
}

export interface NewsAnnouncement {
  id: number;
  title_si: string;
  title_en: string;
  description_si: string;
  description_en: string;
  image_url?: string | null;
  category: 'vacancy' | 'notice' | 'tender' | 'general' | string;
  badge_text_si?: string | null;
  badge_text_en?: string | null;
  is_pinned: boolean;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: number;
  business_key: string;
  business_name: string;
  user_id?: number | null;
  user_name: string;
  phone: string;
  email?: string | null;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  reply_message?: string | null;
  replied_at?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessServiceItem {
  id: number;
  business_key: string;
  title_si: string;
  title_en: string;
  desc_si?: string | null;
  desc_en?: string | null;
  features_si?: string[];
  features_en?: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FuelPrice {
  id: string;
  name_en: string;
  name_si: string;
  price_per_liter: number;
  updated_at: string;
}

