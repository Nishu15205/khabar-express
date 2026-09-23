/** Article DTO shared between server and client. */
export interface NewsArticle {
  guid: string;
  title: string;
  description: string;
  link: string;
  category: string;
  source: string;
  views: number;
  publishedAt: string; // ISO date string
}

export interface NewsResponse {
  ok: boolean;
  articles: NewsArticle[];
  error?: string;
}
