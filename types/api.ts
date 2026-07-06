export interface Outlet {
  id: string;
  name: string;
  logoUrl?: string;
  country: 'RO' | 'EU';
}

export interface OutletWithStatus extends Outlet {
  enabled: boolean;
}

export interface Article {
  id: string;
  outletId: string;
  outlet: Outlet;
  title: string;
  summary?: string;
  imageUrl?: string;
  link: string;
  category?: string;
  publishedAt: string;
  fetchedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ArticleQueryParams {
  category?: string;
  outletIds?: string[];
  page?: number;
  limit?: number;
}