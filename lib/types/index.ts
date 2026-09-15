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
