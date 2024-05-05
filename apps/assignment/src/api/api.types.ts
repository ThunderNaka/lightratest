export interface RequestParams<T> {
  searchText?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: T;
  with?: string | string[];
}

interface Pagination {
  count: number;
  currentPage: number;
  links: { next: string; previous: string };
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ServiceResponse<T> {
  data: T;
  pagination: Pagination;
  status: number;
  success: boolean;
}
