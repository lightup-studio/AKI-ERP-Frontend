export interface ApiResponse<T> {
  data: T;
  status: string;
  message: string;
}

export interface Pagination<T> {
  data: T[];
  offset: number;
  take: number;
  pageCount: number;
  totalCount: number;
}