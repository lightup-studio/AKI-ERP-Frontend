export interface ApiResponse<T> {
  data: T;
  status: string;
  message: string;
}

export interface Pagination<T> {
  rows: T[];
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
}