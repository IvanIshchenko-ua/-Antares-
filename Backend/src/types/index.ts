import { RowDataPacket } from 'mysql2';
import { Request } from 'express';

// User types
export interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'teacher';
  created_at?: Date;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: 'user' | 'admin' | 'teacher';
}

// News types
export interface News extends RowDataPacket {
  id: number;
  title: string;
  shortDescription: string;
  fullContent: string;
  image?: string | null;
  author: string;
  isPublished: boolean;
  publishDate?: Date;
  views: number;
}

export interface NewsCreateData {
  title: string;
  shortDescription: string;
  fullContent: string;
  image?: string;
  author?: string;
}

// Content types
export interface Content extends RowDataPacket {
  id: number;
  page_name: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
}

// Gallery types
export interface GalleryImage extends RowDataPacket {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  category: string;
  is_published: boolean;
  created_at?: Date;
}

// Express Request with user
export interface AuthRequest extends Request {
  user?: JWTPayload;
  body: any;
}

// API Responses
export interface ErrorResponse {
  success: false;
  message: string;
}

export interface SuccessResponse<T> {
  success: true;
  data?: T;
  message?: string;
}
